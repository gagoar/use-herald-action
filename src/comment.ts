import groupBy from 'lodash.groupby';
import table from 'markdown-table';

import { EMAIL_REGEX, maxPerPage } from './util/constants';

import { startGroup, endGroup } from '@actions/core';
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { logger } from './util/debug';
import { ActionMapInput } from '.';
import { MatchingRule } from './rules';
import { env } from './environment';
import { getBlobURL } from './util/getBlobURL';
import { catchHandler } from './util/catchHandler';
import PQueue from 'p-queue';

type AllCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];

type AllCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

type IssueComments = AllCommentsResponse['data'];

const debug = logger('comment');

enum TypeOfComments {
  standalone = 'standalone',
  combined = 'combined',
}

type Mention = { rule: string; mentions: string[]; URL: string };

const LINE_BREAK = '<br/>';
const formatUser = (handleOrEmail: string) => {
  return EMAIL_REGEX.test(handleOrEmail.toLowerCase()) ? handleOrEmail : `@${handleOrEmail}`;
};

const commentTemplate = (mentions: Mention[]): string =>
  `
   <details open>\n
   <summary> Hi there, given these changes, Herald suggest these users should take a look! </summary>\n
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
  <!--herald-use-action-->
  `;

export const composeCommentsForUsers = (matchingRules: (MatchingRule & { blobURL: string })[]): string[] => {
  const groups = groupBy(matchingRules, (rule) =>
    rule.customMessage ? TypeOfComments.standalone : TypeOfComments.combined
  );

  let comments = [] as string[];

  if (groups[TypeOfComments.combined]) {
    const mentions = groups[TypeOfComments.combined].reduce(
      (memo, { name, path, users, teams, blobURL }) => [
        ...memo,
        { URL: blobURL, rule: name || path, mentions: [...users, ...teams] },
      ],
      [] as Mention[]
    );

    comments = [...comments, commentTemplate([...new Set(mentions)])];
  }

  if (groups[TypeOfComments.standalone]) {
    const customMessages = groups[TypeOfComments.standalone]
      .filter((rule) => rule.customMessage)
      .map(({ customMessage }) => customMessage as string);
    comments = [...comments, ...customMessages];
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
  startGroup('comment tests');

  debug('handleComment called with:', matchingRules);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const rulesWithBlobURL = matchingRules.map((mRule) => ({
    ...mRule,
    blobURL: getBlobURL(mRule.path, files, owner, repo, base),
  }));
  const commentsFromRules = composeCommentsForUsers(rulesWithBlobURL);
  const rawComments = await getAllComments(client, {
    owner,
    repo,
    issue_number: prNumber,
  });
  const comments = rawComments.map(({ body }) => body);

  const onlyNewComments = commentsFromRules.filter((comment: string) => !comments.includes(comment));

  debug('comments to add:', onlyNewComments);

  const queue = new PQueue({ concurrency: requestConcurrency });

  const calls = await Promise.all(
    onlyNewComments.map((body: string) => {
      return queue.add(() =>
        client.issues.createComment({
          owner,
          repo,
          issue_number: prNumber,
          body,
        })
      );
    })
  ).catch(catchHandler(debug));

  endGroup();

  return calls;
};
