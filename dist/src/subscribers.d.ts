import { MatchingRule } from './rules';
import { Octokit } from '@octokit/rest';
export declare const handleSubscribers: (client: InstanceType<typeof Octokit>, owner: string, repo: string, prNumber: number, matchingRules: MatchingRule[], requestConcurrency?: number) => Promise<void[]>;
