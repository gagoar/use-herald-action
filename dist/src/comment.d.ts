import { MatchingRule } from './rules';
import { Octokit } from '@octokit/rest';
export declare const handleComment: (client: InstanceType<typeof Octokit>, owner: string, repo: string, prNumber: number, matchingRules: MatchingRule[], requestConcurrency?: number) => Promise<import("@octokit/types").OctokitResponse<import("@octokit/types").IssuesCreateCommentResponseData>[]>;
