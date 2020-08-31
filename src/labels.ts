import { Octokit } from '@octokit/rest';
import { MatchingRule } from './rules';
import PQueue from 'p-queue';
import { logger } from './util/debug';
import { makeArray } from './util/makeArray';

const debug = logger('labels');

export const handleLabels = async (
  client: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  prNumber: number,
  matchingRules: MatchingRule[],
  requestConcurrency = 1
): Promise<unknown> => {
  const queue = new PQueue({ concurrency: requestConcurrency });

  debug('called with:', matchingRules);

  const labels = matchingRules
    .filter(({ labels }) => labels)
    .reduce((memo, { labels }) => [...memo, ...makeArray(labels)], [] as string[]);

  debug('labels', labels);

  if (!labels.length) {
    debug('no labels where found');
    return undefined;
  }
  const result = await queue.add(() =>
    client.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels,
    })
  );

  debug('result:', result);
  return result;
};
