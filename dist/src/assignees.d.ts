import { Octokit } from '@octokit/rest';
import { MatchingRule } from './rules';
export declare const handleAssignees: (client: InstanceType<typeof Octokit>, owner: string, repo: string, prNumber: number, matchingRules: MatchingRule[], requestConcurrency?: number) => Promise<unknown>;
