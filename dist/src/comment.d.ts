import { ActionMapInput } from '.';
import { MatchingRule } from './rules';
export declare const composeCommentsForUsers: (matchingRules: (MatchingRule & {
    blobURL: string;
})[]) => string[];
export declare const handleComment: ActionMapInput;
