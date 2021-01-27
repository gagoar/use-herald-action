/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Generated type guards for "rules.ts".
 * WARNING: Do not manually change this file.
 */
import { RuleActions, Rule, MatchingRule } from './rules';

export function isRuleActions(obj: unknown, _argumentName?: string): obj is RuleActions {
  return (
    obj === RuleActions.comment ||
    obj === RuleActions.review ||
    obj === RuleActions.status ||
    obj === RuleActions.assign ||
    obj === RuleActions.label
  );
}

export function isRule(obj: any, _argumentName?: string): obj is Rule {
  return (
    ((obj !== null && typeof obj === 'object') || typeof obj === 'function') &&
    (typeof obj.name === 'undefined' || typeof obj.name === 'string') &&
    typeof obj.path === 'string' &&
    Array.isArray(obj.users) &&
    obj.users.every((e: any) => typeof e === 'string') &&
    Array.isArray(obj.teams) &&
    obj.teams.every((e: any) => typeof e === 'string') &&
    (obj.action === 'comment' ||
      obj.action === 'review' ||
      obj.action === 'status' ||
      obj.action === 'assign' ||
      obj.action === 'label') &&
    (typeof obj.includes === 'undefined' ||
      (Array.isArray(obj.includes) && obj.includes.every((e: any) => typeof e === 'string'))) &&
    (typeof obj.excludes === 'undefined' ||
      (Array.isArray(obj.excludes) && obj.excludes.every((e: any) => typeof e === 'string'))) &&
    (typeof obj.includesInPatch === 'undefined' ||
      (Array.isArray(obj.includesInPatch) && obj.includesInPatch.every((e: any) => typeof e === 'string'))) &&
    (typeof obj.eventJsonPath === 'undefined' ||
      (Array.isArray(obj.eventJsonPath) && obj.eventJsonPath.every((e: any) => typeof e === 'string'))) &&
    (typeof obj.customMessage === 'undefined' || typeof obj.customMessage === 'string') &&
    (typeof obj.labels === 'undefined' ||
      (Array.isArray(obj.labels) && obj.labels.every((e: any) => typeof e === 'string'))) &&
    (typeof obj.description === 'undefined' || typeof obj.description === 'string') &&
    (typeof obj.targetURL === 'undefined' || typeof obj.targetURL === 'string') &&
    (typeof obj.errorLevel === 'undefined' || obj.errorLevel === 'none' || obj.errorLevel === 'error')
  );
}

export function isMatchingRule(obj: any, _argumentName?: string): obj is MatchingRule {
  return (
    (isRule(obj) as boolean) ||
    (((obj !== null && typeof obj === 'object') || typeof obj === 'function') && typeof obj.matched === 'boolean')
  );
}
