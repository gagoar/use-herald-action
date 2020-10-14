import { RestEndpointMethodTypes } from '@octokit/rest';
export declare const maxPerPage = 100;
export declare const OUTPUT_NAME = "appliedRules";
export declare const FILE_ENCODING = "utf8";
export declare const STATUS_DESCRIPTION_COPY = "You can see the rule by clicking on Details";
export declare const COMBINED_TAG_KEY = "_combined";
export declare const LINE_BREAK = "<br/>";
export declare const USE_HERALD_ACTION_TAG_REGEX: RegExp;
export declare const EMAIL_REGEX: RegExp;
export declare enum CommitStatus {
    SUCCESS = "success",
    FAILURE = "failure"
}
export declare enum SUPPORTED_EVENT_TYPES {
    PULL_REQUEST = "pull_request",
    PULL_REQUEST_TARGET = "pull_request_target",
    push = "push"
}
interface Commit {
    sha: string;
}
interface Owner {
    login: string;
    id: number;
}
interface Repository {
    name: string;
    owner: Owner;
}
interface PullRequest {
    head: Commit;
    base: Commit;
    body: string;
    organization: string;
}
export interface Event {
    action: string;
    number: number;
    pull_request: PullRequest;
    repository: Repository;
}
export declare type OctokitFile = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];
export declare type RuleFile = Partial<OctokitFile> & Required<Pick<OctokitFile, 'filename' | 'blob_url'>>;
export {};
