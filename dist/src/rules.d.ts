import { Event } from './util/constants';
import { RestEndpointMethodTypes } from '@octokit/rest';
declare enum RuleMatchers {
    includesInPatch = "includesInPatch",
    eventJsonPath = "eventJsonPath",
    includes = "includes"
}
export declare enum RuleActions {
    comment = "comment",
    review = "review",
    assign = "assign"
}
declare enum ErrorLevels {
    none = "none",
    error = "error"
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
    errorLevel?: keyof typeof ErrorLevels;
}
declare type File = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];
export declare const loadRules: (rulesLocation: string) => Rule[];
export declare type MatchingRule = Rule & {
    matches: Partial<Record<RuleMatchers | 'includeExclude', unknown[]>>;
};
export declare const allRequiredRulesHaveMatched: (rules: Rule[], matchingRules: MatchingRule[]) => boolean;
export declare const getMatchingRules: (rules: Rule[], files: Partial<File> & Required<Pick<File, 'filename'>>[], event: Event, patchContent: string[]) => MatchingRule[];
export declare const composeCommentsForUsers: (matchingRules: MatchingRule[]) => string[];
export {};
