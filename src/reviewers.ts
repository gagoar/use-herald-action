/* eslint-disable @typescript-eslint/camelcase */
import { Octokit } from '@octokit/rest';
import PQueue from 'p-queue';

import { MatchingRule } from './rules';
import { logger } from './util/debug';

const debug = logger('reviewers');
export const handleReviewers = async (
  client: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  prNumber: number,
  matchingRules: MatchingRule[],
  requestConcurrency = 1
) => {
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
          team_reviewers: matchingRule.teams.map((team) =>
            team.replace('@', '')
          ),
        })
      )
    )
  );
  debug('result:', result);
  return result;
};
