/* eslint-disable @typescript-eslint/camelcase */
import { getInput, setOutput, setFailed } from '@actions/core';
import groupBy from 'lodash.groupBy';
import { handleComment } from './comment';
import { loadRules, getMatchingRules, RuleActions } from './rules';
import { env, Event, SUPPORTED_EVENT_TYPES, OUTPUT_NAME } from './environment';

import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import { handleAssignees } from './assignees';
import { handleReviewers } from './reviewers';

const EnhancedOctokit = Octokit.plugin(retry);

export enum Props {
  GITHUB_TOKEN = 'GITHUB_TOKEN',
  rulesLocation = 'rulesLocation',
  dryRun = 'dryRun',
  subscribeAction = 'subscribeAction',
  base = 'base',
  lint = 'lint',
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
      const event = require(env.GITHUB_EVENT_PATH) as Event;

      const { pull_request, number: prNumber } = event;

      const {
        repo: {
          owner: { login: owner },
          full_name: repo,
        },
      } = pull_request;

      const {
        GITHUB_TOKEN,
        rulesLocation,
        base = 'master',
        dryRun = false,
      } = getParams();

      const rules = loadRules(rulesLocation);

      const client = new EnhancedOctokit({ auth: GITHUB_TOKEN });

      const {
        data: { files },
      } = await client.repos.compareCommits({
        base,
        head: pull_request.head.sha,
        owner,
        repo,
      });

      const matchingRules = getMatchingRules(rules, files, event);

      if (!dryRun) {
        if (matchingRules.length) {
          const groups = groupBy(matchingRules, (rule) => rule.action);

          const groupNames = Object.keys(groups) as ActionName[];

          await Promise.all([
            groupNames.map((actionName: ActionName) => {
              const action = actionsMap[RuleActions[actionName]];

              return action(
                client,
                owner,
                repo,
                prNumber,
                groups[RuleActions.comment]
              );
            }),
          ]);
        }
      }

      setOutput(OUTPUT_NAME, matchingRules);
    } else {
      setOutput(OUTPUT_NAME, []);
      throw new Error('use-herald only supports pull_request events for now');
    }
  } catch (e) {
    setFailed(e);
  }
};
