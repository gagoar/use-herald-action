export declare enum Props {
    GITHUB_TOKEN = "GITHUB_TOKEN",
    rulesLocation = "rulesLocation",
    dryRun = "dryRun",
    base = "base"
}
export declare const beta: () => Promise<{
    rules: import("./rules").Rule[];
    dir: any;
    params: typeof Props;
}>;
export declare const main: () => Promise<void>;
