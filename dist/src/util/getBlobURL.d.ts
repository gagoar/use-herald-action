import { RuleFile } from './constants';
/**
 * getBlobURL will return a URL for the provided fileName.
 * It will figure out if the file is part of the changeSet or not and return the correct URL for it.
 */
export declare const getBlobURL: (filename: string, files: RuleFile[], owner: string, repo: string, base: string) => string;
