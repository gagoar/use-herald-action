import PQueue from 'p-queue';
import groupBy from 'lodash.groupby';
import table from 'markdown-table';

import { EMAIL_REGEX, maxPerPage } from './util/constants';

import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { logger } from './util/debug';
import { ActionMapInput } from '.';
import { MatchingRule } from './rules';
import { env } from './environment';
import { getBlobURL } from './util/getBlobURL';

type AllCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];

type AllCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

type IssueComments = AllCommentsResponse['data'];

type IssueComment = IssueComments[0];

const debug = logger('comment');

enum TypeOfComments {
  standalone = 'standalone',
  combined = 'combined',
}

type Mention = { rule: string; mentions: string[]; URL: string };

const LINE_BREAK = '<br/>';
const USE_HERALD_ACTION_TAG_REGEX = /^<!-- USE_HERALD_ACTION (.*) -->$/;

const formatUser = (handleOrEmail: string) => {
  return EMAIL_REGEX.test(handleOrEmail.toLowerCase()) ? handleOrEmail : `@${handleOrEmail}`;
};

const tagComment = (body: string, path: string) => `<!-- USE_HERALD_ACTION ${path} -->\n${body}`;

const commentTemplate = (mentions: Mention[]): string =>
  `
   <details open>\n
   <summary> Hi there, given these changes, Herald thinks that these users should take a look! </summary>\n
   ${table(
     [
       ['Rule', 'Mention'],
       ...mentions.map(({ rule, URL, mentions }) => [
         `[${rule.replace(`${env.GITHUB_WORKSPACE}/`, '')}](${URL})`,
         mentions.map((user) => formatUser(user)).join(LINE_BREAK),
       ]),
     ],
     { align: ['l', 'c'] }
   )}\n
  </details>
  `;

/**
 * This function takes a list of mathcing rules, and returns a map with rule name/path as keys, and
 *  the comment body as values. We return a map instead of an array so we can determine which
 *  comments we can skip reposting to avoid repeition, and which we can edit to update. We rely on
 *  the fact that no two matching rules share the same path.
 * @param matchingRules List of matching rules
 */
export const composeCommentsForUsers = (
  matchingRules: (MatchingRule & { blobURL: string })[]
): Record<string, string> => {
  const groups = groupBy(matchingRules, (rule) =>
    rule.customMessage ? TypeOfComments.standalone : TypeOfComments.combined
  );

  let comments = {} as Record<string, string>;

  if (groups[TypeOfComments.combined]) {
    const mentions = groups[TypeOfComments.combined].reduce(
      (memo, { name, path, users, teams, blobURL }) => [
        ...memo,
        { URL: blobURL, rule: name || path, mentions: [...users, ...teams] },
      ],
      [] as Mention[]
    );

    // Since combined comments may originate from multiple rules/teams, we use _combined as the key
    //  to this comment by convention.
    comments = {
      ...comments,
      _combined: commentTemplate([...new Set(mentions)]),
    };
  }

  if (groups[TypeOfComments.standalone]) {
    const customMessages = groups[TypeOfComments.standalone]
      .filter((rule) => rule.customMessage)
      .reduce(
        (memo, { path, customMessage }) => ({
          ...memo,
          [path]: customMessage as string,
        }),
        {} as Record<string, string>
      );
    comments = { ...comments, ...customMessages };
  }

  return comments;
};

const getAllComments = async (
  client: InstanceType<typeof Octokit>,
  params: AllCommentsParams
): Promise<IssueComments> => {
  const page = 1;
  const { data: comments } = await client.issues.listComments({
    ...params,
    per_page: maxPerPage,
    page,
  });

  if (comments.length < maxPerPage) {
    return comments;
  } else {
    const { data: moreComments } = await client.issues.listComments({
      ...params,
      page: page + 1,
      per_page: maxPerPage,
    });
    return [...comments, ...moreComments];
  }
};

export const handleComment: ActionMapInput = async (
  client,
  { owner, repo, prNumber, matchingRules, files, base },
  requestConcurrency = 1
): Promise<unknown> => {
  debug('handleComment called with:', matchingRules);

  const queue = new PQueue({ concurrency: requestConcurrency });

  const rulesWithBlobURL = matchingRules.map((mRule) => ({
    ...mRule,
    blobURL: getBlobURL(mRule.path, files, owner, repo, base),
  }));

  const commentsFromRules = composeCommentsForUsers(rulesWithBlobURL);

  debug('comments from matching rules:', commentsFromRules);

  const rawComments = await getAllComments(client, {
    owner,
    repo,
    issue_number: prNumber,
  });

  // Filter existing comments by USE_HERALD_ACTION tag (HTML comment) and key by path
  const useHeraldActionComments = rawComments.reduce((memo, comment) => {
    const pathMatch = USE_HERALD_ACTION_TAG_REGEX.exec(comment.body.split('\n')[0]);
    return pathMatch ? { ...memo, [pathMatch[1]]: comment } : memo;
  }, {} as Record<string, IssueComment>);

  debug('existing UHA comments:', useHeraldActionComments);

  // Update existing comments
  const updateCommentPromises = Object.keys(commentsFromRules)
    .filter((key) => key in useHeraldActionComments)
    .map((key) => {
      // get comment number
      const comment_id = useHeraldActionComments[key].id;
      const body = tagComment(commentsFromRules[key], key);
      return queue.add(() =>
        client.issues.updateComment({
          owner,
          repo,
          comment_id,
          body,
        })
      );
    });

  // Add new comments
  const createCommentPromises = Object.keys(commentsFromRules)
    .filter((key) => !(key in useHeraldActionComments))
    .map((key) => {
      const body = tagComment(commentsFromRules[key], key);
      return queue.add(() =>
        client.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body,
        })
      );
    });

  return Promise.all([...updateCommentPromises, ...createCommentPromises]);
};
