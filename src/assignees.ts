/* eslint-disable @typescript-eslint/camelcase */
import { Octokit } from '@octokit/rest';
import { MatchingRule } from './rules';
import PQueue from 'p-queue';
import { logger } from './util/debug';

const debug = logger('assignees');

export const handleAssignees = async (
  client: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  prNumber: number,
  matchingRules: MatchingRule[],
  requestConcurrency = 1
) => {
  const queue = new PQueue({ concurrency: requestConcurrency });

  debug('handleAssignees called with:', matchingRules);

  const result = await Promise.all(
    matchingRules.map((matchingRule) =>
      queue.add(() =>
        client.issues.addAssignees({
          owner,
          repo,
          issue_number: prNumber,
          assignees: matchingRule.users.map((user) => user.replace('@', '')),
        })
      )
    )
  );

  debug('handleAssignees result:', result);
  return result;
};
