/* eslint-disable @typescript-eslint/camelcase */
import { getInput, setOutput, setFailed } from '@actions/core';
import groupBy from 'lodash.groupby';
import { handleComment } from './comment';
import { loadRules, getMatchingRules, RuleActions } from './rules';
import { Event, SUPPORTED_EVENT_TYPES, OUTPUT_NAME } from './util/constants';
import { env } from './environment';

import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import { handleAssignees } from './assignees';
import { handleReviewers } from './reviewers';
import { loadJSONFile } from './util/loadJSONFile';

const EnhancedOctokit = Octokit.plugin(retry);

export enum Props {
  GITHUB_TOKEN = 'GITHUB_TOKEN',
  rulesLocation = 'rulesLocation',
  dryRun = 'dryRun',
  base = 'base',
}

const actionsMap = {
  [RuleActions.comment]: handleComment,
  [RuleActions.assign]: handleAssignees,
  [RuleActions.review]: handleReviewers,
};

type ActionName = keyof typeof RuleActions;

const getParams = () => {
  return Object.keys(Props).reduce((memo, prop) => {
    const value = getInput(prop);
    return value ? { ...memo, [prop]: value } : memo;
  }, {} as typeof Props);
};

export const main = async () => {
  try {
    if (env.GITHUB_EVENT_NAME === SUPPORTED_EVENT_TYPES.PULL_REQUEST) {
      const event = loadJSONFile(env.GITHUB_EVENT_PATH) as Event;

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

      const {
        GITHUB_TOKEN,
        rulesLocation,
        base = baseSha,
        dryRun = false,
      } = getParams();

      const rules = loadRules(rulesLocation);

      const client = new EnhancedOctokit({ auth: GITHUB_TOKEN });

      const {
        data: { files },
      } = await client.repos.compareCommits({
        base,
        head: headSha,
        owner,
        repo,
      });

      const matchingRules = getMatchingRules(rules, files, event);

      const groupedRulesByAction = groupBy(
        matchingRules,
        (rule) => rule.action
      );

      if (!dryRun) {
        if (matchingRules.length) {
          const groupNames = Object.keys(groupedRulesByAction) as ActionName[];

          await Promise.all([
            groupNames.map((actionName: ActionName) => {
              const action = actionsMap[RuleActions[actionName]];

              return action(
                client,
                owner,
                repo,
                prNumber,
                groupedRulesByAction[RuleActions.comment]
              );
            }),
          ]);
        }
      }

      setOutput(OUTPUT_NAME, groupedRulesByAction);
    } else {
      setOutput(OUTPUT_NAME, []);
      throw new Error('use-herald only supports pull_request events for now');
    }
  } catch (e) {
    setFailed(e);
  }
};
