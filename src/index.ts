/* eslint-disable @typescript-eslint/camelcase */
import { getInput, setOutput, setFailed } from '@actions/core';

import { handleSubscribers } from './subscribers';
import { loadRules, getMatchingRules } from './rules';
import { env, Event, SUPPORTED_EVENT_TYPES, OUTPUT_NAME } from './environment';

import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import { handleAssignees } from './assignees';
import { handleReviewers } from './reviewers';

const EnhancedOctokit = Octokit.plugin(retry);

enum SubscriberActionOptions {
  comment = 'comment',
  assignees = 'assignees',
  reviewer = 'reviewer',
}
export enum Props {
  GITHUB_TOKEN = 'GITHUB_TOKEN',
  rulesLocation = 'rulesLocation',
  dryRun = 'dryRun',
  subscribeAction = 'subscribeAction',
  base = 'base',
  lint = 'lint',
}

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
        subscribeAction,
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

      let matchingRules = getMatchingRules(rules, files, event);

      if (!dryRun) {
        if (matchingRules.length) {
          if (subscribeAction === String(SubscriberActionOptions.comment)) {
            await handleSubscribers(
              client,
              owner,
              repo,
              prNumber,
              matchingRules
            );
          }

          if (subscribeAction === String(SubscriberActionOptions.assignees)) {
            // moving all subscribers to assignees.
            matchingRules = matchingRules.map((matchingRule) => {
              const {
                subscribers = [],
                assignees = [],
                ...rest
              } = matchingRule;
              return { ...rest, assignees: [...assignees, ...subscribers] };
            });
          }

          if (subscribeAction === String(SubscriberActionOptions.reviewer)) {
            matchingRules = matchingRules.map((matchingRule) => {
              const {
                subscribers = [],
                reviewers = [],
                ...rest
              } = matchingRule;
              return { ...rest, reviewers: [...reviewers, ...subscribers] };
            });
          }
        }

        await handleAssignees(client, owner, repo, prNumber, matchingRules);

        await handleReviewers(client, owner, repo, prNumber, matchingRules);
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
