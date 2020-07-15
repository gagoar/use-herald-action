/* eslint-disable @typescript-eslint/no-var-requires */
import { sync } from 'fast-glob';
import { basename } from 'path';
import { Event } from './environment';
import minimatch from 'minimatch';

import { RestEndpointMethodTypes } from '@octokit/rest';

import { JSONPath } from '@astronautlabs/jsonpath';
import { loadJSONFile } from './util/loadJSONFile';

const commentTemplate = (users: string[]): string =>
  `Hi there, Herald found that given these changes ${users.join(
    ', '
  )} might want to take a look!`;

enum RuleActors {
  users = 'users',
  teams = 'teams',
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
export enum RuleActions {
  comment = 'comment',
  review = 'review',
  assign = 'assign',
}
export interface Rule {
  name?: string;
  path: string;
  users: string[];
  teams: string[];
  action: keyof typeof RuleActions;
  glob?: string;
  eventJsonPath?: string;
  customMessage?: string;
}

type File = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];

type RawRule = Rule & { users?: string; teams?: string };

const sanitize = (content: RawRule & StringIndexSignatureInterface): Rule => {
  const attrs = { ...RuleMatchers, ...RuleActors, ...RuleExtras };

  const rule = ['action', ...Object.keys(attrs)].reduce((memo, attr) => {
    return content[attr] ? { ...memo, [attr]: content[attr] } : memo;
  }, {} as RawRule);

  const users = rule.users?.split(',');
  const teams = rule.teams?.split(',');

  return { ...rule, users, teams };
};

const hasAttribute = <Attr extends string>(
  attr: string,
  content: object
): content is Record<Attr, string> => attr in content;

const isValidRawRule = (content: unknown): content is RawRule => {
  if (typeof content !== 'object' || content === null) {
    return false;
  }

  const hasValidActionValues =
    hasAttribute<'action'>('action', content) &&
    Object.keys(RuleActions).includes(content.action);

  const hasTeams =
    (hasAttribute('teams', content) && content.teams && true) || false;
  const hasUsers =
    (hasAttribute('users', content) && content.users && true) || false;
  const hasActors = hasTeams || hasUsers;
  const matchers = Object.keys(RuleMatchers).some((attr) => attr in content);

  return hasValidActionValues && hasActors && matchers;
};

export const loadRules = (rulesLocation: string): Rule[] => {
  const matches = sync(rulesLocation, { onlyFiles: true });

  const rules = matches.reduce((memo, filePath) => {
    try {
      const rule = loadJSONFile(filePath);

      return isValidRawRule(rule)
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

export type MatchingRule = Rule & {
  matches: Partial<Record<RuleMatchers, unknown[]>>;
};

export const getMatchingRules = (
  rules: Rule[],
  files: Partial<File> & Required<Pick<File, 'filename'>>[],
  event: Event
): MatchingRule[] => {
  const fileNames = files.map(({ filename }) => filename);

  const matchingRules = rules.reduce((memo, rule) => {
    const matches = {} as MatchingRule['matches'];

    if (rule.glob) {
      matches.glob = fileNames.filter(
        minimatch.filter(rule.glob, { matchBase: true })
      );
    }

    if (rule.eventJsonPath) {
      matches.eventJsonPath = JSONPath.query(event, rule.eventJsonPath);
    }

    return Object.values(matches).length
      ? [...memo, { ...rule, matches }]
      : memo;
  }, [] as MatchingRule[]);

  console.info('matching rules:', matchingRules);

  return matchingRules;
};

export const composeCommentsForUsers = (
  matchingRules: MatchingRule[]
): string[] => {
  return matchingRules.reduce((comments, { teams, users, customMessage }) => {
    return [
      ...comments,
      customMessage ? customMessage : commentTemplate([...users, ...teams]),
    ];
  }, [] as string[]);
};
