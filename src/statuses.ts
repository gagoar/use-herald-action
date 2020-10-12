import { RuleActions } from './rules';
import PQueue from 'p-queue';
import { logger } from './util/debug';
import { CommitStatus, STATUS_DESCRIPTION_COPY } from './util/constants';
import type { ActionMapInput } from './index';
import { getBlobURL } from './util/getBlobURL';
import { catchHandler } from './util/catchHandler';

const debug = logger('statuses');

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

  const statuses = statusActionRules.map((rule) => ({
    owner,
    repo,
    sha,
    context: `Herald › ${rule.name}`,
    description: rule.description ? rule.description : STATUS_DESCRIPTION_COPY,
    target_url: rule.targetURL ? rule.targetURL : getBlobURL(rule.path, files, owner, repo, base),
    state: matchingRules.find((matchingRule) => matchingRule.path === rule.path)
      ? CommitStatus.SUCCESS
      : CommitStatus.FAILURE,
  }));

  debug('statuses', statuses);
  const result = await Promise.all(
    statuses.map((status) => queue.add(() => client.repos.createCommitStatus(status)))
  ).catch(catchHandler(debug));

  debug('result:', result);
  return result;
};
