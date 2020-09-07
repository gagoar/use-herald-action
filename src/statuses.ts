import { RuleActions } from './rules';
import isEqual from 'lodash.isequal';
import PQueue from 'p-queue';
import { logger } from './util/debug';
import { CommitStatus, RuleFile } from './util/constants';
import type { ActionMapInput } from './index';
import { env } from './environment';

const debug = logger('statuses');

const getBlobURL = (filename: string, files: RuleFile[], baseBlobPath: string, base: string) => {
  debug('getBlobURL', filename, files, baseBlobPath, base);
  const file = files.find((file) => filename.match(file.filename));

  return file ? file.blob_url : `${baseBlobPath}/${base}/${filename.replace(`${env.GITHUB_WORKSPACE}/`, '')}`;
};

export const handleStatus: ActionMapInput = async (
  client,
  { owner, repo, matchingRules, rules, base, sha, files },
  requestConcurrency = 1
): Promise<unknown> => {
  debug('called with:', matchingRules);

  const queue = new PQueue({ concurrency: requestConcurrency });

  const statusActionRules = rules.filter(({ action }) => action == RuleActions.status);

  const baseBlobPath = `https://github.com/${owner}/${repo}/blob`;
  const statuses = statusActionRules.map((rule) => ({
    owner,
    repo,
    sha,
    description: rule.name,
    context: `herald/${rule.name}`,
    target_url: getBlobURL(rule.path, files, baseBlobPath, base),
    state: matchingRules.find((matchingRule) => isEqual(matchingRule, { ...rule, matched: true }))
      ? CommitStatus.SUCCESS
      : CommitStatus.FAILURE,
  }));

  debug('statuses', statuses);
  return Promise.all(statuses.map((status) => queue.add(() => client.repos.createCommitStatus(status))));
};
