import PQueue from 'p-queue';
import { logger } from './util/debug';
import { ActionMapInput } from '.';

const debug = logger('assignees');

export const handleAssignees: ActionMapInput = async (
  client,
  { owner, repo, prNumber, matchingRules },
  requestConcurrency = 1
): Promise<unknown> => {
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
