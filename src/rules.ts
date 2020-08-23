/* eslint-disable @typescript-eslint/no-var-requires */
import { sync } from 'fast-glob';
import { basename } from 'path';
import { Event } from './util/constants';
import { env } from './environment';
import minimatch from 'minimatch';
import groupBy from 'lodash.groupby';

import { RestEndpointMethodTypes } from '@octokit/rest';

import JSONPath from 'jsonpath';
import { loadJSONFile } from './util/loadJSONFile';
import { logger } from './util/debug';
import { makeArray } from './util/makeArray';

const debug = logger('rules');

const commentTemplate = (users: string[]): string =>
  `Hi there, Herald found that given these changes ${users
    .map((user) => `@${user}`)
    .join(', ')} might want to take a look! \n 
  <!-- herald-use-action -->`;

enum RuleActors {
  users = 'users',
  teams = 'teams',
}

enum RuleExtras {
  customMessage = 'customMessage',
  name = 'name',
  errorLevel = 'errorLevel',
}
enum RuleMatchers {
  includesInPatch = 'includesInPatch',
  eventJsonPath = 'eventJsonPath',
  includes = 'includes',
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

enum ErrorLevels {
  none = 'none',
  error = 'error',
}
export interface Rule {
  name?: string;
  path: string;
  users: string[];
  teams: string[];
  action: keyof typeof RuleActions;
  includes?: string[];
  excludes?: string[];
  includesInPatch?: string[];
  eventJsonPath?: string;
  customMessage?: string;

  errorLevel?: keyof typeof ErrorLevels;
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
    includes: makeArray(rule.includes),
    excludes: makeArray(rule.excludes),
    includesInPatch: makeArray(rule.includesInPatch),
  };
};

const hasAttribute = <Attr extends string>(
  attr: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>
): content is Record<Attr, string> => attr in content;

const isValidRawRule = (content: unknown): content is RawRule => {
  if (typeof content !== 'object' || content === null) {
    return false;
  }

  const hasValidActionValues =
    hasAttribute<'action'>('action', content) && Object.keys(RuleActions).includes(content.action);

  const hasTeams = hasAttribute('teams', content) && Array.isArray(content.teams);
  const hasUsers = hasAttribute('users', content) && Array.isArray(content.users);
  const hasActors =
    hasTeams ||
    hasUsers ||
    (hasAttribute('customMessage', content) && !!content.customMessage && content.action === RuleActions.comment);

  const matchers = Object.keys(RuleMatchers).some((attr) => attr in content);

  debug('validation:', {
    rule: content,
    hasActors,
    hasValidActionValues,
    matchers,
  });

  return hasValidActionValues && hasActors && matchers;
};

export const loadRules = (rulesLocation: string): Rule[] => {
  const matches = sync(rulesLocation, {
    onlyFiles: true,
    cwd: env.GITHUB_WORKSPACE,
    absolute: true,
  });

  debug('files found:', matches);
  const rules = matches.reduce((memo, filePath) => {
    try {
      const rule = loadJSONFile(filePath);

      return isValidRawRule(rule) ? [...memo, { name: basename(filePath), ...sanitize(rule), path: filePath }] : memo;
    } catch (e) {
      console.error(`${filePath} can't be parsed, it will be ignored`);
      return memo;
    }
  }, [] as Rule[]);

  return rules;
};

export type MatchingRule = Rule & {
  matches: Partial<Record<RuleMatchers | 'includeExclude', unknown[]>>;
};

type IncludeExcludeFilesParams = {
  includes?: string[];
  excludes?: string[];
  fileNames: string[];
};

const includeExcludeFiles = ({ includes, excludes, fileNames }: IncludeExcludeFilesParams) => {
  debug('includeExcludeFiles...');
  const matches = {} as MatchingRule['matches'];

  let results = [] as string[];

  if (includes?.length) {
    results = includes.reduce((memo, include) => {
      const matches = minimatch.match(fileNames, include, { matchBase: true });
      return [...memo, ...matches];
    }, [] as string[]);

    matches[RuleMatchers.includes] = [...new Set(results)];

    if (excludes?.length && results.length) {
      const toExclude = excludes.reduce((memo, exclude) => {
        const matches = minimatch.match(results, exclude, { matchBase: true });
        return [...memo, ...matches];
      }, [] as string[]);
      results = results.filter((filename) => !toExclude.includes(filename));
    }
    debug('evaluating includes:', matches);
  }

  if (includes?.length && excludes?.length) {
    return { includeExclude: results };
  }

  return matches;
};
const handleIncludesInPath = (patterns: string[], patchContent: string[]): string[] => {
  debug('handleIncludesInPath...');
  const matches = patterns.reduce((memo, pattern) => {
    try {
      const rex = new RegExp(pattern);
      const matches = patchContent.find((content) => content.match(rex));

      return matches ? [...memo, matches] : memo;
    } catch (e) {
      debug(`pattern: ${pattern} failed to parse`, e);
      return memo;
    }
  }, [] as string[]);

  return [...new Set(matches)];
};

export const allRequiredRulesHaveMatched = (rules: Rule[], matchingRules: MatchingRule[]): boolean => {
  const requiredRules = rules.filter((rule) => rule.errorLevel && rule.errorLevel === ErrorLevels.error);

  // if we don't have any required rule, we assume all required rules have passed.
  if (!requiredRules.length) {
    return true;
  }

  const matchingRulesNames = matchingRules.map((rule) => rule.name);
  return requiredRules.every((rule) => matchingRulesNames.includes(rule.name));
};
export const getMatchingRules = (
  rules: Rule[],
  files: Partial<File> & Required<Pick<File, 'filename'>>[],
  event: Event,
  patchContent: string[]
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
      debug('eventJsonPath', rule.eventJsonPath, event.pull_request.body);
      try {
        matches.eventJsonPath = JSONPath.query(event, rule.eventJsonPath);
      } catch (e) {
        debug('something went wrong with the query:Error:', e);
      }
    }

    if (rule.includesInPatch?.length) {
      debug('includesInPatch');
      matches.includesInPatch = handleIncludesInPath(rule.includesInPatch, patchContent);
    }

    matches = { ...matches, ...extraMatches };

    return Object.values(matches).some((value) => value?.length) ? [...memo, { ...rule, matches }] : memo;
  }, [] as MatchingRule[]);

  return matchingRules;
};

enum TypeOfComments {
  standalone = 'standalone',
  combined = 'combined',
}
export const composeCommentsForUsers = (matchingRules: MatchingRule[]): string[] => {
  const groups = groupBy(matchingRules, (rule) =>
    rule.customMessage ? TypeOfComments.standalone : TypeOfComments.combined
  );

  let comments = [] as string[];

  if (groups[TypeOfComments.combined]) {
    const mentions = groups[TypeOfComments.combined].reduce(
      (memo, { users, teams }) => [...memo, ...users, ...teams],
      [] as string[]
    );

    comments = [...comments, commentTemplate([...new Set(mentions)])];
  }

  if (groups[TypeOfComments.standalone]) {
    const customMessages = groups[TypeOfComments.standalone]
      .filter((rule) => rule.customMessage)
      .map(({ customMessage }) => customMessage as string);
    comments = [...comments, ...customMessages];
  }

  return comments;
};
