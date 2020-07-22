/* eslint-disable @typescript-eslint/no-var-requires */
import { sync } from 'fast-glob';
import { basename } from 'path';
import { Event } from './util/constants';
import { env } from './environment';
import minimatch from 'minimatch';

import { RestEndpointMethodTypes } from '@octokit/rest';

import { JSONPath } from '@astronautlabs/jsonpath';
import { loadJSONFile } from './util/loadJSONFile';
import { logger } from './util/debug';

const debug = logger('rules');

const commentTemplate = (users: string[]): string =>
  `Hi there, Herald found that given these changes ${users.join(
    ', '
  )} might want to take a look! \n 
  <!-- herald-use-action -->`;

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
  includes = 'includes',
  excludes = 'excludes',
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
  includes?: string;
  excludes?: string;
  eventJsonPath?: string;
  customMessage?: string;
}

type File = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];

type RawRule = Rule & { users?: string[]; teams?: string[] };

const sanitize = (content: RawRule & StringIndexSignatureInterface): Rule => {
  const attrs = { ...RuleMatchers, ...RuleActors, ...RuleExtras };

  const rule = ['action', ...Object.keys(attrs)].reduce((memo, attr) => {
    return content[attr] ? { ...memo, [attr]: content[attr] } : memo;
  }, {} as RawRule);
  return {
    ...rule,
    users: rule.users ? rule.users : [],
    teams: rule.teams ? rule.teams : [],
  };
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
    hasAttribute('teams', content) && Array.isArray(content.teams);
  const hasUsers =
    hasAttribute('users', content) && Array.isArray(content.users);
  const hasActors = hasTeams || hasUsers;

  const matchers = Object.keys(RuleMatchers).some((attr) => attr in content);

  debug(
    `validation: ${{
      rule: content,
      hasActors,
      hasValidActionValues,
      matchers,
    }}`
  );

  return hasValidActionValues && hasActors && matchers;
};

export const loadRules = (rulesLocation: string): Rule[] => {
  const matches = sync(rulesLocation, {
    onlyFiles: true,
    cwd: env.GITHUB_WORKSPACE,
    absolute: true,
  });

  debug(`files found: ${matches}`);
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

  return rules;
};

export type MatchingRule = Rule & {
  matches: Partial<Record<RuleMatchers | 'includeExclude', unknown[]>>;
};

type IncludeExcludeFilesParams = {
  includes?: string;
  excludes?: string;
  fileNames: string[];
};

const includeExcludeFiles = ({
  includes,
  excludes,
  fileNames,
}: IncludeExcludeFilesParams) => {
  const matches = {} as MatchingRule['matches'];

  let results = [] as string[];

  if (includes) {
    results = minimatch.match(fileNames, includes, { matchBase: true });
    matches[RuleMatchers.includes] = results;
    if (excludes && results.length) {
      const toExclude = minimatch.match(results, excludes, { matchBase: true });
      results = results.filter((filename) => !toExclude.includes(filename));
    }
    debug('evaluating includes:', matches);
  }

  if (includes && excludes) {
    return { includeExclude: results };
  }

  return matches;
};
export const getMatchingRules = (
  rules: Rule[],
  files: Partial<File> & Required<Pick<File, 'filename'>>[],
  event: Event
): MatchingRule[] => {
  const fileNames = files.map(({ filename }) => filename);

  const matchingRules = rules.reduce((memo, rule) => {
    let matches = {} as MatchingRule['matches'];

    const extraMatches = includeExcludeFiles({
      includes: rule.includes,
      excludes: rule.excludes,
      fileNames,
    });

    if (rule.eventJsonPath) {
      matches.eventJsonPath = JSONPath.query(event, rule.eventJsonPath);
    }

    matches = { ...matches, ...extraMatches };

    return Object.values(matches).length
      ? [...memo, { ...rule, matches }]
      : memo;
  }, [] as MatchingRule[]);

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
