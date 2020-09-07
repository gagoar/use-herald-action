import { MatchingRule, Rule } from './rules';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
export declare enum Props {
    GITHUB_TOKEN = "GITHUB_TOKEN",
    rulesLocation = "rulesLocation",
    dryRun = "dryRun",
    base = "base"
}
declare type OctokitFile = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];
declare type ActionInput = {
    owner: string;
    repo: string;
    prNumber: number;
    matchingRules: MatchingRule[];
    rules: Rule[];
    sha: string;
    base: string;
    files: OctokitFile[];
};
export declare type ActionMapInput = (client: InstanceType<typeof Octokit>, options: ActionInput, requestConcurrency?: number) => Promise<unknown>;
export declare const main: () => Promise<void>;
export {};
