import { Octokit } from '@octokit/rest';
import { MatchingRule, Rule } from './rules';
export declare const handleStatus: (client: InstanceType<typeof Octokit>, owner: string, repo: string, _prNumber: number, matchingRules: MatchingRule[], rules: Rule[], sha: string, requestConcurrency?: number) => Promise<unknown>;
