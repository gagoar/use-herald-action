import { logger } from './util/debug';
import { ActionMapInput } from '.';
import { catchHandler } from './util/catchHandler';

const debug = logger('assignees');

export const handleAssignees: ActionMapInput = async (
  client,
  { owner, repo, prNumber, matchingRules }
): Promise<unknown> => {
  debug('handleAssignees called with:', matchingRules);

  const assignees = matchingRules.reduce((memo, rule) => {
    return [...memo, ...rule.users.map((user) => user.replace('@', ''))];
  }, [] as string[]);

  debug('assignees found:', assignees);

  return client.issues
    .addAssignees({
      owner,
      repo,
      issue_number: prNumber,
      assignees,
    })
    .catch(catchHandler(debug));
};
