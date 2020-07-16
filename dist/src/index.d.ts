export declare enum Props {
    GITHUB_TOKEN = "GITHUB_TOKEN",
    rulesLocation = "rulesLocation",
    dryRun = "dryRun",
    base = "base"
}
export declare const beta: () => Promise<{
    response: {
        rules: import("./rules").Rule[];
        dir: any;
        params: typeof Props;
    };
    subset: {
        repo: string;
        owner: string;
        baseSha: string;
        headSha: string;
        prNumber: number;
    };
}>;
export declare const main: () => Promise<void>;
