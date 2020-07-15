import envalid from 'envalid';
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
export declare const env: Readonly<{
    GITHUB_EVENT_PATH: "/github/workflow/event.json";
    GITHUB_EVENT_NAME: "pull_request";
    GITHUB_REPOSITORY: any;
    GITHUB_SHA: any;
}> & envalid.CleanEnv & {
    readonly [varName: string]: string | undefined;
};
export {};
