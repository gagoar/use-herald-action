/* eslint-disable @typescript-eslint/no-var-requires */
import { sync } from 'fast-glob';
import { basename } from 'path';
import { memo } from './util/memoizeDecorator';
import { Event, MATCH_RULE_CONCURRENCY, RuleFile } from './util/constants';
import { env } from './environment';
import minimatch from 'minimatch';

import JSONPath from 'jsonpath';
import { loadJSONFile } from './util/loadJSONFile';
import { logger } from './util/debug';
import { makeArray } from './util/makeArray';
import groupBy from 'lodash.groupby';
import PQueue from 'p-queue';
import { catchHandler } from './util/catchHandler';
import { isMatchingRule } from './rules.guard';

const debug = logger('rules');

enum RuleActors {
  users = 'users',
  teams = 'teams',
}

enum RuleExtras {
  customMessage = 'customMessage',
  name = 'name',
  errorLevel = 'errorLevel',
  labels = 'labels',
  description = 'description',
  targetURL = 'targetURL',
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
  status = 'status',
  assign = 'assign',
  label = 'label',
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
  eventJsonPath?: string[];
  customMessage?: string;
  labels?: string[];
  description?: string;
  targetURL?: string;
  errorLevel?: keyof typeof ErrorLevels;
}

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
    eventJsonPath: makeArray(rule.eventJsonPath),
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
    (hasAttribute('customMessage', content) && !!content.customMessage && content.action === RuleActions.comment) ||
    (hasAttribute('labels', content) && !!content.labels && content.action === RuleActions.label) ||
    (hasAttribute('action', content) && content.action === RuleActions.status);
  const matchers = Object.keys(RuleMatchers).some((attr) => attr in content);

  debug('validation:', {
    rule: content,
    hasActors,
    hasValidActionValues,
    matchers,
  });

  return hasValidActionValues && hasActors && matchers;
};

export type MatchingRule = Rule & {
  matched: boolean;
};

type IncludeExcludeFilesParams = {
  includes?: string[];
  excludes?: string[];
  fileNames: string[];
};

const handleIncludeExcludeFiles = ({ includes, excludes, fileNames }: IncludeExcludeFilesParams): boolean => {
  debug('includeExcludeFiles...');

  let results = [] as string[];

  if (includes?.length) {
    results = includes.reduce((memo, include) => {
      const matches = minimatch.match(fileNames, include, { matchBase: true });
      return [...memo, ...matches];
    }, [] as string[]);

    results = [...new Set(results)];

    debug('includes matches', { results, includes });

    if (excludes?.length && results.length) {
      const toExclude = excludes.reduce((memo, exclude) => {
        const matches = minimatch.match(results, exclude, { matchBase: true });
        return [...memo, ...matches];
      }, [] as string[]);
      results = results.filter((filename) => !toExclude.includes(filename));

      debug('excludes matches:', { results, excludes });
    }
  }

  return !!results.length;
};

type HandleIncludesInPatch = (options: { patterns?: string[]; patch: string[] }) => boolean;

const handleIncludesInPatch: HandleIncludesInPatch = ({ patterns, patch }) => {
  debug('handleIncludesInPath...');
  const matches = patterns?.reduce((memo, pattern) => {
    try {
      const rex = new RegExp(pattern);
      const matches = patch?.find((content) => content.match(rex));

      return matches ? [...memo, matches] : memo;
    } catch (e) {
      debug(`pattern: ${pattern} failed to parse`, e);
      return memo;
    }
  }, [] as string[]);

  return !!matches?.length;
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
type HandleEventJsonPath = (options: { event: Event; patterns?: string[] }) => boolean;

const handleEventJsonPath: HandleEventJsonPath = ({ event, patterns }) => {
  debug('eventJsonPath', patterns);
  try {
    let results;
    patterns?.find((pattern) => {
      const matches = JSONPath.query(event, pattern);

      if (matches.length) {
        results = matches;
      }

      return matches.length;
    });

    debug('eventJSONPath matches:', results);
    return !!results;
  } catch (e) {
    debug('eventJsonPath:Error:', e);
  }
  return false;
};

type Matcher = (rule: Rule, options: { event: Event; patch: string[]; fileNames: string[] }) => Promise<boolean>;

const matchers: Record<string, Matcher> = {
  [RuleMatchers.includes]: async (rule, { fileNames }) =>
    handleIncludeExcludeFiles({ includes: rule.includes, excludes: rule.excludes, fileNames }),
  [RuleMatchers.eventJsonPath]: async (rule, { event }) => handleEventJsonPath({ patterns: rule.eventJsonPath, event }),
  [RuleMatchers.includesInPatch]: async (rule, { patch }) =>
    handleIncludesInPatch({ patterns: rule.includesInPatch, patch }),
};

type KeyMatchers = keyof typeof RuleMatchers;

const isMatch: Matcher = async (rule, options) => {
  const keyMatchers = Object.keys(RuleMatchers) as KeyMatchers[];
  const matches = keyMatchers
    .filter((matcher) => rule[matcher]?.length)
    .map((matcher) => matchers[matcher](rule, options));

  debug('isMatch:', { rule, matches });

  const resolvedMatches = await Promise.all(matches).catch(catchHandler(debug));
  return matches.length ? (resolvedMatches as unknown[]).every((match) => match === true) : false;
};

export class Rules extends Array<Rule> {
  public constructor(...items: Rule[]) {
    super(...items);
  }
  static loadFromLocation(location: string): Rules {
    const matches = sync(location, {
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

    return new Rules(...rules);
  }
  async getMatchingRules(files: RuleFile[], event: Event, patchContent?: string[]): Promise<MatchingRules> {
    return MatchingRules.load(this, files, event, patchContent);
  }
}

class MatchingRules extends Array<MatchingRule> {
  private constructor(...items: MatchingRule[]) {
    super(...items);
  }

  @memo()
  private groupByAction() {
    return groupBy(this, (rule) => rule.action);
  }
  groupBy(action: keyof typeof RuleActions): MatchingRule[] {
    const grouped = this.groupByAction()[action];
    return grouped || [];
  }

  static async load(
    rules: Rules,
    files: RuleFile[],
    event: Event,
    patchContent: string[] = []
  ): Promise<MatchingRules> {
    const queue = new PQueue({ concurrency: MATCH_RULE_CONCURRENCY });
    const fileNames = files.map(({ filename }) => filename);

    const matchingRules = rules.map((rule) => {
      return queue.add(async () => {
        const matched = await isMatch(rule, { event, patch: patchContent, fileNames });

        return { ...rule, matched } as MatchingRule;
      });
    });

    const matchedRules = await Promise.all(matchingRules);

    const filtered = matchedRules.filter((rule) => isMatchingRule(rule) && rule.matched);

    return new MatchingRules(...filtered);
  }
}
