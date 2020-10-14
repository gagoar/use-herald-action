import { Debugger } from 'debug';
export declare const catchHandler: (debug: Debugger) => (error: Error) => Promise<unknown>;
