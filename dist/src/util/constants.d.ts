export declare const maxPerPage = 100;
export declare const OUTPUT_NAME = "appliedRules";
export declare const FILE_ENCODING = "utf8";
export declare enum SUPPORTED_EVENT_TYPES {
    PULL_REQUEST = "pull_request"
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
    organization: string;
}
export interface Event {
    action: string;
    number: number;
    pull_request: PullRequest;
    repository: Repository;
}
export {};
