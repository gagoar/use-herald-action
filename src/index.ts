import { getInput, setOutput, setFailed } from '@actions/core';
import groupBy from 'lodash.groupby';
import { loadRules, getMatchingRules, RuleActions, allRequiredRulesHaveMatched } from './rules';
import { Event, OUTPUT_NAME, SUPPORTED_EVENT_TYPES } from './util/constants';
import { logger } from './util/debug';
import { env } from './environment';

import { Octokit } from '@octokit/rest';
import { handleAssignees } from './assignees';
import { handleLabels } from './labels';
import { handleReviewers } from './reviewers';
import { handleStatus } from './statuses';
import { handleComment } from './comment';
import { loadJSONFile } from './util/loadJSONFile';
import { isEventSupported } from './util/isEventSupported';

const debug = logger('index');

const EnhancedOctokit = Octokit;

export enum Props {
  GITHUB_TOKEN = 'GITHUB_TOKEN',
  rulesLocation = 'rulesLocation',
  dryRun = 'dryRun',
  base = 'base',
}

const actionsMap = {
  [RuleActions.status]: handleStatus,
  [RuleActions.comment]: handleComment,
  [RuleActions.assign]: handleAssignees,
  [RuleActions.review]: handleReviewers,
  [RuleActions.label]: handleLabels,
};

type ActionName = keyof typeof RuleActions;

const getParams = () => {
  return Object.keys(Props).reduce((memo, prop) => {
    const value = getInput(prop);
    return value ? { ...memo, [prop]: value } : memo;
  }, {} as Partial<Record<keyof typeof Props, string>>);
};

export const main = async (): Promise<void> => {
  try {
    if (isEventSupported(env.GITHUB_EVENT_NAME)) {
      const event = loadJSONFile<Event>(env.GITHUB_EVENT_PATH);

      const {
        pull_request: {
          head: { sha: headSha },
          base: { sha: baseSha },
        },
        number: prNumber,
        repository: {
          name: repo,
          owner: { login: owner },
        },
      } = event;

      const { GITHUB_TOKEN, rulesLocation, base = baseSha, dryRun } = getParams();

      debug('params:', { rulesLocation, base, dryRun });

      if (!rulesLocation) {
        const message = `${Props.rulesLocation} is required`;
        setFailed(message);
        throw new Error(message);
      }

      const rules = loadRules(rulesLocation);

      debug('loaded rules and locations', {
        rules,
        dir: env.GITHUB_WORKSPACE,
        rulesLocation,
      });
      const client = new EnhancedOctokit({ auth: GITHUB_TOKEN });

      const {
        data: { files },
      } = await client.repos.compareCommits({
        base,
        head: headSha,
        owner,
        repo,
      });

      const matchingRules = getMatchingRules(
        rules,
        files,
        event,
        files.map(({ patch }) => patch)
      );

      debug('matchingRules:', matchingRules);

      if (!allRequiredRulesHaveMatched(rules, matchingRules)) {
        throw new Error(
          `Not all Rules with errorLevel set to error have matched. Please double check that these rules apply: ${rules
            .filter((rule) => rule.errorLevel && rule.errorLevel === 'error')
            .map((rule) => rule.name)
            .join(', ')}`
        );
      }

      const groupedRulesByAction = groupBy(matchingRules, (rule) => rule.action);

      if (dryRun !== 'true') {
        debug('not a dry Run');

        if (matchingRules.length) {
          const groupNames = Object.keys(groupedRulesByAction) as ActionName[];

          debug('groupNames', groupNames);

          try {
            await Promise.all([
              groupNames.map((actionName: ActionName) => {
                const action = actionsMap[RuleActions[actionName]];

                return action(
                  client,
                  owner,
                  repo,
                  prNumber,
                  groupedRulesByAction[RuleActions[actionName]],
                  rules,
                  headSha
                );
              }),
            ]);
          } catch (e) {
            debug('Promises Failed', e);
          }
        }
      }

      setOutput(OUTPUT_NAME, groupedRulesByAction);
    } else {
      setOutput(OUTPUT_NAME, []);
      throw new Error(
        `use-herald-action only supports [${Object.values(SUPPORTED_EVENT_TYPES).join(
          ', '
        )}] events for now, event found: ${env.GITHUB_EVENT_NAME}`
      );
    }
  } catch (e) {
    setFailed(e);
  }
};
