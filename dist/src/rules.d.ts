import { Event } from './environment';
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
export declare const loadRules: (rulesLocation: string) => Rule[];
export declare type MatchingRule = Rule & {
    matches: unknown[];
};
export declare const getMatchingRules: (rules: Rule[], files: {
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch: string;
}[], event: Event) => MatchingRule[];
export declare const composeCommentsFromRules: (matchingRules: MatchingRule[]) => string[];
