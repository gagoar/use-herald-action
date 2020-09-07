import { Event, RuleFile } from './util/constants';
export declare enum RuleActions {
    comment = "comment",
    review = "review",
    status = "status",
    assign = "assign",
    label = "label"
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
    labels?: string[];
    description?: string;
    errorLevel?: keyof typeof ErrorLevels;
}
export declare const loadRules: (rulesLocation: string) => Rule[];
export declare type MatchingRule = Rule & {
    matched: boolean;
};
export declare const allRequiredRulesHaveMatched: (rules: Rule[], matchingRules: MatchingRule[]) => boolean;
export declare const getMatchingRules: (rules: Rule[], files: RuleFile[], event: Event, patchContent: string[]) => MatchingRule[];
export declare const composeCommentsForUsers: (matchingRules: MatchingRule[]) => string[];
export {};
