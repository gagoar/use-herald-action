/* eslint-disable @typescript-eslint/camelcase */
import PQueue from 'p-queue';

import { composeCommentsForUsers, MatchingRule } from './rules';

import { maxPerPage } from './environment';

import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
type AllCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];

type AllCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

type IssueComments = AllCommentsResponse['data'];

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

export const handleComment = async (
  client: InstanceType<typeof Octokit>,
  owner: string,
  repo: string,
  prNumber: number,
  matchingRules: MatchingRule[],
  requestConcurrency = 1
) => {
  const queue = new PQueue({ concurrency: requestConcurrency });
  const commentsFromRules = composeCommentsForUsers(matchingRules);
  const rawComments = await getAllComments(client, {
    owner,
    repo,
    issue_number: prNumber,
  });
  const comments = rawComments.map(({ body }) => body);

  const onlyNewComments = commentsFromRules.filter(
    (comment: string) => !comments.includes(comment)
  );

  return Promise.all(
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
  );
};
