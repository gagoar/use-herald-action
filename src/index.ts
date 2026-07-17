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

type PullRequestDiff = {
  prNumber: number;
  headSha: string;
  baseSha: string;
  files: RuleFile[];
};

const loadPullRequestDiff = async (
  client: InstanceType<typeof Octokit>,
  event: Event,
  base: string | undefined
): Promise<PullRequestDiff> => {
  // Only pull_request/pull_request_target/push events reach here — main() guards this with isDispatchEvent.
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
    // pull_request/number are guaranteed present for these event types; narrowed here rather than
    // widening the shared Event type back to required fields.
  } = event as Required<Pick<Event, 'pull_request' | 'number'>> & Event;

  const {
    data: { files },
  } = await client.repos.compareCommits({
    base: base || baseSha,
    head: headSha,
    owner,
    repo,
  });

  return { prNumber, headSha, baseSha, files: files || [] };
};

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
      // String(...): envalid's str({devDefault: 'pull_request'}) narrows GITHUB_EVENT_NAME's type to
      // that literal at the type level, even though the runtime value is any supported event name.
      const isDispatchEvent = String(env.GITHUB_EVENT_NAME) === SUPPORTED_EVENT_TYPES.repository_dispatch;

      const {
        repository: {
          name: repo,
          owner: { login: owner },
        },
      } = event;

      const { GITHUB_TOKEN, rulesLocation, base: baseInput, dryRun } = getParams();

      debug('params:', { rulesLocation, base: baseInput, dryRun, isDispatchEvent });

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

      // repository_dispatch carries no pull_request to diff or act on — rules for that event type
      // match purely via eventJsonPath against the whole event (incl. client_payload).
      const { prNumber, headSha, baseSha, files } = isDispatchEvent
        ? { prNumber: undefined, headSha: undefined, baseSha: undefined, files: [] as RuleFile[] }
        : await loadPullRequestDiff(client, event, baseInput);

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

      if (dryRun !== 'true' && !isDispatchEvent) {
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
                // non-null: this branch only runs when isDispatchEvent is false, where loadPullRequestDiff always resolves these.
                prNumber: prNumber as number,
                matchingRules: rulesForAction,
                rules,
                sha: headSha as string,
                base: baseSha as string,
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
