import { Octokit } from '@octokit/rest';
import { MatchingRule, Rule, RuleActions } from './rules';
import isEqual from 'lodash.isequal';
import PQueue from 'p-queue';
import { logger } from './util/debug';
import { CommitStatus } from './util/constants';

const debug = logger('status');

export const handleStatus = async (
  client: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  _prNumber: number,
  matchingRules: MatchingRule[],
  rules: Rule[],
  sha: string,
  requestConcurrency = 1
): Promise<unknown> => {
  const queue = new PQueue({ concurrency: requestConcurrency });

  debug('called with:', matchingRules);

  const statusActionRules = rules.filter(({ action }) => action == RuleActions.status);

  const statuses = statusActionRules.map((rule) => ({
    owner,
    repo,
    sha,
    description: rule.name,
    context: `use-herald-action/${rule.name}`,
    state: matchingRules.find((matchingRule) => isEqual(matchingRule, { ...rule, matched: true }))
      ? CommitStatus.SUCCESS
      : CommitStatus.FAILURE,
  }));

  debug('statuses', statuses);
  return Promise.all(statuses.map((status) => queue.add(() => client.repos.createCommitStatus(status))));
};
