/* eslint-disable @typescript-eslint/no-var-requires */
import { readFileSync } from 'fs';
import { sync } from 'fast-glob';
import { basename } from 'path';
import { Event, FILE_ENCODING } from './environment';
import minimatch from 'minimatch';

import { RestEndpointMethodTypes } from '@octokit/rest';

import { JSONPath } from '@astronautlabs/jsonpath';

const commentTemplate = (subscribers: string[]): string =>
  `Hi there, Herald found that given these changes ${subscribers.join(
    ', '
  )} might want to take a look!`;
enum RuleActors {
  subscribers = 'subscribers',
  reviewers = 'reviewers',
  assignees = 'assignees',
}

enum RuleExtras {
  customMessage = 'customMessage',
  name = 'name',
}
enum RuleMatchers {
  eventJsonPath = 'eventJsonPath',
  glob = 'glob',
}

// Nothings lost, nothings added except string indexes
interface StringIndexSignatureInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}
export interface Rule {
  name?: string;
  path: string;
  subscribers?: string[];
  reviewers?: string[];
  assignees?: string[];
  glob?: string;
  eventJsonPath?: string;
  customMessage?: string;
}

type Files = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'];

const sanitize = (content: Rule & StringIndexSignatureInterface): Rule => {
  const attrs = { ...RuleMatchers, ...RuleActors, ...RuleExtras };
  const rule = Object.keys(attrs).reduce((memo, attr) => {
    return content[attr] ? { ...memo, [attr]: content[attr] } : memo;
  }, {} as Rule);

  return rule;
};

const isValidRule = (content: unknown): content is Rule => {
  if (typeof content !== 'object' || content === null) {
    return false;
  }

  const actors = Object.keys(RuleActors).some((attr) => attr in content);
  const matchers = Object.keys(RuleMatchers).some((attr) => attr in content);

  return actors && matchers;
};

export const loadRules = (rulesLocation: string): Rule[] => {
  const matches = sync(rulesLocation, { onlyFiles: true });

  const rules = matches.reduce((memo, filePath) => {
    try {
      const content = readFileSync(filePath, { encoding: FILE_ENCODING });
      const rule = JSON.parse(content) as unknown;

      return isValidRule(rule)
        ? [
            ...memo,
            { name: basename(filePath), ...sanitize(rule), path: filePath },
          ]
        : memo;
    } catch (e) {
      console.log(`${filePath} can't be parsed, it will be ignored`);
      return memo;
    }
  }, [] as Rule[]);

  console.info('found rules:', rules);

  return rules;
};

export type MatchingRule = Rule & { matches: unknown[] };

export const getMatchingRules = (
  rules: Rule[],
  files: Files,
  event: Event
): MatchingRule[] => {
  const fileNames = files.map(({ filename }) => filename);

  const matchingRules = rules.reduce((memo, rule) => {
    let matches: unknown[] = [];
    if (rule.glob) {
      matches = fileNames.filter(
        minimatch.filter(rule.glob, { matchBase: true })
      );
    } else if (rule.eventJsonPath) {
      matches = JSONPath.query(event, rule.eventJsonPath);
    }

    return matches.length ? [...memo, { ...rule, matches }] : memo;
  }, [] as MatchingRule[]);

  console.info('matching rules:', matchingRules);

  return matchingRules;
};

export const composeCommentsFromRules = (
  matchingRules: MatchingRule[]
): string[] => {
  return matchingRules.reduce((comments, matchingRule) => {
    return matchingRule.subscribers
      ? [
          ...comments,
          matchingRule.customMessage
            ? matchingRule.customMessage
            : commentTemplate(matchingRule.subscribers),
        ]
      : comments;
  }, [] as string[]);
};
