/* eslint-disable @typescript-eslint/camelcase */
import { Octokit } from '@octokit/rest';
import { MatchingRule } from './rules';
import PQueue from 'p-queue';

export const handleAssignees = async (
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
        client.issues.addAssignees({
          owner,
          repo,
          issue_number: prNumber,
          assignees: matchingRule.assignees,
        })
      )
    )
  );
};
