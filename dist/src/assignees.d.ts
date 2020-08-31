import { Octokit } from '@octokit/rest';
import { MatchingRule, Rule } from './rules';
export declare const handleAssignees: (client: InstanceType<typeof Octokit>, owner: string, repo: string, prNumber: number, matchingRules: MatchingRule[], _rules: Rule[], _sha: string, requestConcurrency?: number) => Promise<unknown>;
