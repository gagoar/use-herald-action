import { Event } from './util/constants';
import { RestEndpointMethodTypes } from '@octokit/rest';
declare enum RuleMatchers {
    eventJsonPath = "eventJsonPath",
    includes = "includes",
    excludes = "excludes"
}
export declare enum RuleActions {
    comment = "comment",
    review = "review",
    assign = "assign"
}
export interface Rule {
    name?: string;
    path: string;
    users: string[];
    teams: string[];
    action: keyof typeof RuleActions;
    includes?: string[];
    excludes?: string;
    eventJsonPath?: string;
    customMessage?: string;
}
declare type File = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];
export declare const loadRules: (rulesLocation: string) => Rule[];
export declare type MatchingRule = Rule & {
    matches: Partial<Record<RuleMatchers | 'includeExclude', unknown[]>>;
};
export declare const getMatchingRules: (rules: Rule[], files: Partial<File> & Required<Pick<File, 'filename'>>[], event: Event) => MatchingRule[];
export declare const composeCommentsForUsers: (matchingRules: MatchingRule[]) => string[];
export {};
