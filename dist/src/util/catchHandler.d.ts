import { Debugger } from 'debug';
interface HttpError extends Error {
    status: number;
}
export declare const catchHandler: (debug: Debugger) => (error: HttpError) => Promise<unknown>;
export {};
