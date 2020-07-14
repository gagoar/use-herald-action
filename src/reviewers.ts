/* eslint-disable @typescript-eslint/camelcase */
import { Octokit } from '@octokit/rest';
import PQueue from 'p-queue';

import { MatchingRule } from './rules';

export const handleReviewers = async (
  client: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  prNumber: number,
  matchingRules: MatchingRule[],
  requestConcurrency = 1
) => {
  const queue = new PQueue({ concurrency: requestConcurrency });
  return Promise.all(
    matchingRules.map((matchingRule) =>
      queue.add(() =>
        client.pulls.requestReviewers({
          owner,
          repo,
          pull_number: prNumber,
          reviewers: matchingRule.users,
          team_reviewers: matchingRule.teams,
        })
      )
    )
  );
};
