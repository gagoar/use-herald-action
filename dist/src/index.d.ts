import { MatchingRule, Rule } from './rules';
import { RuleFile } from './util/constants';
import { Octokit } from '@octokit/rest';
export declare enum Props {
    GITHUB_TOKEN = "GITHUB_TOKEN",
    rulesLocation = "rulesLocation",
    dryRun = "dryRun",
    base = "base"
}
export declare type ActionInput = {
    owner: string;
    repo: string;
    prNumber: number;
    matchingRules: MatchingRule[];
    rules: Rule[];
    sha: string;
    base: string;
    files: RuleFile[];
};
export declare type ActionMapInput = (client: InstanceType<typeof Octokit>, options: ActionInput, requestConcurrency?: number) => Promise<unknown>;
export declare const main: () => Promise<void>;
