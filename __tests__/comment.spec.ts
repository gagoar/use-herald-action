import { handleComment } from '../src/comment';
import { Octokit } from '@octokit/rest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import getCommentsResponse from '../__mocks__/scenarios/get_comments.json';
import createIssueResponse from '../__mocks__/scenarios/create_comment.json';

jest.mock('../src/util/constants', () => ({
  maxPerPage: 2,
}));

describe('handleComment', () => {
  const client = new Octokit();
  const owner = 'gagoar';
  const repo = 'example_repo';
  const prIssue = 1;
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should publish a comment (pulling 2 pages of comments)', async () => {
    const rule = {
      users: ['@eeny', '@meeny', '@miny', '@moe'],
      includes: ['*.ts'],
      action: RuleActions.comment,
      path: 'rules/rule.json',
      customMessage: 'Custom message',
      teams: [],
      matches: { includes: ['fileChanged.ts'] },
    };

    const github = nock('https://api.github.com')
      .get(`/repos/${owner}/${repo}/issues/${prIssue}/comments?page=1&per_page=2`)
      .reply(200, getCommentsResponse.slice(0, 2));

    github
      .get(`/repos/${owner}/${repo}/issues/${prIssue}/comments?page=2&per_page=2`)
      .reply(200, [getCommentsResponse[2]]);

    github.post(`/repos/${owner}/${repo}/issues/${prIssue}/comments`).reply(200, createIssueResponse);

    const response = await handleComment(client, owner, repo, 1, [rule]);

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "body": "Custom message",
            "created_at": "2011-04-14T16:00:49Z",
            "html_url": "https://github.com/gagoar/example_repo/issues/1#issuecomment-1",
            "id": 1,
            "node_id": "MDEyOklzc3VlQ29tbWVudDE=",
            "updated_at": "2011-04-14T16:00:49Z",
            "url": "https://api.github.com/repos/gagoar/example_repo/issues/comments/1",
            "user": Object {
              "avatar_url": "https://github.com/images/error/gagoar_happy.gif",
              "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
              "followers_url": "https://api.github.com/users/gagoar/followers",
              "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
              "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
              "gravatar_id": "",
              "html_url": "https://github.com/gagoar",
              "id": 1,
              "login": "gagoar",
              "node_id": "MDQ6VXNlcjE=",
              "organizations_url": "https://api.github.com/users/gagoar/orgs",
              "received_events_url": "https://api.github.com/users/gagoar/received_events",
              "repos_url": "https://api.github.com/users/gagoar/repos",
              "site_admin": false,
              "starred_url": "https://api.github.com/users/gagoar/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/gagoar/subscriptions",
              "type": "User",
              "url": "https://api.github.com/users/gagoar",
            },
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "status": 200,
          "url": "https://api.github.com/repos/gagoar/example_repo/issues/1/comments",
        },
      ]
    `);
  });

  it('should not publish the message because is duplicated', async () => {
    const rule = {
      users: ['@eeny', '@meeny', '@miny', '@moe'],
      includes: ['*.ts'],
      action: RuleActions.comment,
      path: 'rules/rule.json',
      customMessage: 'Custom message',
      teams: [],
      matches: { includes: ['fileChanged.ts'] },
    };

    nock('https://api.github.com')
      .get(`/repos/${owner}/${repo}/issues/${prIssue}/comments?page=1&per_page=2`)
      .reply(200, [getCommentsResponse[0]]);

    const response = await handleComment(client, owner, repo, 1, [{ ...rule, customMessage: 'first comment' }]);

    expect(response).toMatchInlineSnapshot('Array []');
  });
});
