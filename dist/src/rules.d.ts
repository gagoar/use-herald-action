import { Event } from './util/constants';
import { RestEndpointMethodTypes } from '@octokit/rest';
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
    errorLevel?: keyof typeof ErrorLevels;
}
declare type File = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];
export declare const loadRules: (rulesLocation: string) => Rule[];
export declare type MatchingRule = Rule & {
    matched: boolean;
    blobURL: string;
};
export declare const allRequiredRulesHaveMatched: (rules: Rule[], matchingRules: MatchingRule[]) => boolean;
declare type RuleFile = Partial<File> & Required<Pick<File, 'filename' | 'blob_url'>>;
export declare const getMatchingRules: (rules: Rule[], files: RuleFile[], event: Event, patchContent: string[], headSha: string, repo: string, owner: string) => MatchingRule[];
export declare const composeCommentsForUsers: (matchingRules: MatchingRule[]) => string[];
export {};
