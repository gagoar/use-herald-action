import envalid from 'envalid';
export declare const env: Readonly<{
    GITHUB_EVENT_PATH: any;
    GITHUB_WORKSPACE: any;
    GITHUB_EVENT_NAME: "pull_request";
    GITHUB_REPOSITORY: any;
    GITHUB_SHA: any;
    TASK_ID: "use-herald-action";
}> & envalid.CleanEnv & {
    readonly [varName: string]: string | undefined;
};
