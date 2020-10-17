import { ActionMapInput } from '.';
import { MatchingRule } from './rules';
/**
 * This function takes a list of mathcing rules, and returns a map with rule name/path as keys, and
 *  the comment body as values. We return a map instead of an array so we can determine which
 *  comments we can skip reposting to avoid repeition, and which we can edit to update. We rely on
 *  the fact that no two matching rules share the same path.
 * @param matchingRules List of matching rules
 */
export declare const composeCommentsForUsers: (matchingRules: (MatchingRule & {
    blobURL: string;
})[]) => Record<string, string>;
export declare const handleComment: ActionMapInput;
