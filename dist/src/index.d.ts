import { Event } from './util/constants';
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
    event: Event;
}>;
export declare const main: () => Promise<void>;
