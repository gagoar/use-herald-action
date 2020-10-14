import { logger } from './util/debug';
import { makeArray } from './util/makeArray';
import { ActionMapInput } from '.';
import { catchHandler } from './util/catchHandler';

const debug = logger('labels');

export const handleLabels: ActionMapInput = async (
  client,
  { owner, repo, prNumber, matchingRules }
): Promise<unknown> => {
  debug('called with:', matchingRules);

  const labels = matchingRules
    .filter(({ labels }) => labels)
    .reduce((memo, { labels }) => [...memo, ...makeArray(labels)], [] as string[]);

  debug('labels', labels);

  if (!labels.length) {
    debug('no labels where found');
    return undefined;
  }
  const result = client.issues
    .addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels,
    })
    .catch(catchHandler(debug));

  debug('result:', result);
  return result;
};
