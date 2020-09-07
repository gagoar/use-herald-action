import PQueue from 'p-queue';

import { composeCommentsForUsers } from './rules';

import { maxPerPage } from './util/constants';

import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { logger } from './util/debug';
import { ActionMapInput } from '.';
type AllCommentsParams = RestEndpointMethodTypes['issues']['listComments']['parameters'];

type AllCommentsResponse = RestEndpointMethodTypes['issues']['listComments']['response'];

type IssueComments = AllCommentsResponse['data'];

const debug = logger('comment');

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
  { owner, repo, prNumber, matchingRules },
  requestConcurrency = 1
): Promise<unknown> => {
  debug('handleComment called with:', matchingRules);

  const queue = new PQueue({ concurrency: requestConcurrency });
  const commentsFromRules = composeCommentsForUsers(matchingRules);
  const rawComments = await getAllComments(client, {
    owner,
    repo,
    issue_number: prNumber,
  });
  const comments = rawComments.map(({ body }) => body);

  const onlyNewComments = commentsFromRules.filter((comment: string) => !comments.includes(comment));

  debug('comments to add:', onlyNewComments);

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
