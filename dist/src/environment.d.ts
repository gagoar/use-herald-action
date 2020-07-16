import envalid from 'envalid';
export declare const env: Readonly<{
    GITHUB_EVENT_PATH: "/home/runner/work/_temp/_github_workflow/event.json";
    GITHUB_EVENT_NAME: "pull_request";
    GITHUB_REPOSITORY: any;
    GITHUB_SHA: any;
}> & envalid.CleanEnv & {
    readonly [varName: string]: string | undefined;
};
