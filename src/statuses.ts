import { RuleActions } from './rules';
import PQueue from 'p-queue';
import { logger } from './util/debug';
import { CommitStatus, RuleFile, STATUS_DESCRIPTION_COPY } from './util/constants';
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
  debug(
    'called with:',
    matchingRules.map((rule) => rule.path)
  );

  const queue = new PQueue({ concurrency: requestConcurrency });

  const statusActionRules = rules.filter(({ action }) => action == RuleActions.status);

  const baseBlobPath = `https://github.com/${owner}/${repo}/blob`;
  const statuses = statusActionRules.map((rule) => ({
    owner,
    repo,
    sha,
    context: `Herald/${rule.name}`,
    description: rule.description ? rule.description : STATUS_DESCRIPTION_COPY,
    target_url: rule.targetURL ? rule.targetURL : getBlobURL(rule.path, files, baseBlobPath, base),
    state: matchingRules.find((matchingRule) => matchingRule.path === rule.path)
      ? CommitStatus.SUCCESS
      : CommitStatus.FAILURE,
  }));

  debug('statuses', statuses);
  return Promise.all(statuses.map((status) => queue.add(() => client.repos.createCommitStatus(status))));
};
