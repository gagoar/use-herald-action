import { Event } from './environment';
import { RestEndpointMethodTypes } from '@octokit/rest';
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
declare type File = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];
export declare const loadRules: (rulesLocation: string) => Rule[];
export declare type MatchingRule = Rule & {
    matches: unknown[];
};
export declare const getMatchingRules: (rules: Rule[], files: Partial<File> & Required<Pick<File, 'filename'>>[], event: Event) => MatchingRule[];
export declare const composeCommentsForSubscribers: (matchingRules: MatchingRule[]) => string[];
export {};
