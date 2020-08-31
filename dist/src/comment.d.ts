import { MatchingRule, Rule } from './rules';
import { Octokit } from '@octokit/rest';
export declare const handleComment: (client: InstanceType<typeof Octokit>, owner: string, repo: string, prNumber: number, matchingRules: MatchingRule[], _rules: Rule[], _sha: string, requestConcurrency?: number) => Promise<unknown>;
