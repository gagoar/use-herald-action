import { Octokit } from '@octokit/rest';
import { MatchingRule } from './rules';
export declare const handleReviewers: (client: InstanceType<typeof Octokit>, owner: string, repo: string, prNumber: number, matchingRules: MatchingRule[], requestConcurrency?: number) => Promise<import("@octokit/types").OctokitResponse<import("@octokit/types").PullsRequestReviewersResponseData>[]>;
