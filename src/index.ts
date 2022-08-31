import { getInput, setOutput, setFailed } from '@actions/core';
import { Rules, RuleActions, allRequiredRulesHaveMatched, MatchingRule, Rule } from './rules';
import { Event, OUTPUT_NAME, SUPPORTED_EVENT_TYPES, RuleFile } from './util/constants';
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

export type ActionInput = {
  owner: string;
  repo: string;
  prNumber: number;
  matchingRules: MatchingRule[];
  rules: Rule[];
  sha: string;
  base: string;
  files: RuleFile[];
};
export type ActionMapInput = (
  client: InstanceType<typeof Octokit>,
  options: ActionInput,
  requestConcurrency?: number
) => Promise<unknown>;

const actionsMap: Record<RuleActions, ActionMapInput> = {
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

      const rules = Rules.loadFromLocation(rulesLocation);

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

      const matchingRules = await rules.getMatchingRules(
        files,
        event,
        files.reduce((memo, { patch }) => (patch ? [...memo, patch] : memo), [] as string[])
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

      if (dryRun !== 'true') {
        debug('not a dry Run');

        if (matchingRules.length) {
          await Promise.all(
            Object.keys(RuleActions).reduce((promises, actionName) => {
              const action = actionsMap[RuleActions[actionName as ActionName]];

              const rulesForAction = matchingRules.groupBy(actionName as ActionName);

              if (!rulesForAction.length) {
                return promises;
              }
              const options: ActionInput = {
                owner,
                repo,
                prNumber,
                matchingRules: rulesForAction,
                rules,
                sha: headSha,
                base: baseSha,
                files,
              };

              return [...promises, action(client, options)];
            }, [] as Promise<unknown>[])
          ).catch((error: Error) => {
            debug('We found an error calling GitHub:', error);
            throw error;
          });
        }
      }

      setOutput(OUTPUT_NAME, matchingRules);
    } else {
      setOutput(OUTPUT_NAME, []);
      throw new Error(
        `use-herald-action only supports [${Object.values(SUPPORTED_EVENT_TYPES).join(
          ', '
        )}] events for now, event found: ${env.GITHUB_EVENT_NAME}`
      );
    }
  } catch (e) {
    setFailed((e as Error).message);
  }
};
