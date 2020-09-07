import PQueue from 'p-queue';

import { logger } from './util/debug';
import { ActionMapInput } from '.';

const debug = logger('reviewers');
export const handleReviewers: ActionMapInput = async (
  client,
  { owner, repo, prNumber, matchingRules },
  requestConcurrency = 1
): Promise<unknown> => {
  const queue = new PQueue({ concurrency: requestConcurrency });

  debug('handleReviewers called with:', matchingRules);
  const result = await Promise.all(
    matchingRules.map((matchingRule) =>
      queue.add(() =>
        client.pulls.requestReviewers({
          owner,
          repo,
          pull_number: prNumber,
          reviewers: matchingRule.users.map((user) => user.replace('@', '')),
          team_reviewers: matchingRule.teams.map((team) => team.replace('@', '')),
        })
      )
    )
  );
  debug('result:', result);
  return result;
};
