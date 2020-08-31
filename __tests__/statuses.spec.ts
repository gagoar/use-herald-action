import { handleStatus } from '../src/statuses';
import { Octokit } from '@octokit/rest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import createStatusRequest from '../__mocks__/scenarios/create_status.json';
describe('handleReviewers', () => {
  const client = new Octokit();
  const owner = 'gagoar';
  const repo = 'example_repo';
  const prIssue = 1;
  const rule = {
    name: 'it should have ts files in the PR',
    glob: '*.ts',
    action: RuleActions.status,
    path: 'rules/rule.json',
    users: [],
    teams: [],
  };

  const rule2 = { ...rule, name: 'it should have js files in the PR', glob: '*.js' };
  beforeEach(() => {
    nock.cleanAll();
  });
  it('should add status', async () => {
    const sha = '6dcb09b5b57875f334f61aebed695e2e4193db5e';
    const github = nock('https://api.github.com')
      .post(`/repos/${owner}/${repo}/statuses/${sha}`)
      .reply(201, (_uri, body: { target_url: string; description: string; state: string; context: string }, cb) => {
        const { target_url, description, state, context } = body;
        cb(null, { ...createStatusRequest, target_url, description, state, context });
      });

    github
      .post(`/repos/${owner}/${repo}/statuses/${sha}`)
      .reply(201, (_uri, body: { target_url: string; description: string; state: string; context: string }, cb) => {
        const { target_url, description, state, context } = body;
        cb(null, { ...createStatusRequest, target_url, description, state, context });
      });
    const response = await handleStatus(client, owner, repo, prIssue, [{ ...rule, matched: true }], [rule, rule2], sha);

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "avatar_url": "https://github.com/images/error/hubot_happy.gif",
            "context": "use-herald-action",
            "created_at": "2012-07-20T01:19:13Z",
            "creator": Object {
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
            "description": "it should have ts files in the PR",
            "id": 1,
            "node_id": "MDY6U3RhdHVzMQ==",
            "state": "success",
            "target_url": "rules/rule.json",
            "updated_at": "2012-07-20T01:19:13Z",
            "url": "https://api.github.com/repos/gagoar/example_repo/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "status": 201,
          "url": "https://api.github.com/repos/gagoar/example_repo/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
        },
        Object {
          "data": Object {
            "avatar_url": "https://github.com/images/error/hubot_happy.gif",
            "context": "use-herald-action",
            "created_at": "2012-07-20T01:19:13Z",
            "creator": Object {
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
            "description": "it should have js files in the PR",
            "id": 1,
            "node_id": "MDY6U3RhdHVzMQ==",
            "state": "failure",
            "target_url": "rules/rule.json",
            "updated_at": "2012-07-20T01:19:13Z",
            "url": "https://api.github.com/repos/gagoar/example_repo/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          },
          "headers": Object {
            "content-type": "application/json",
          },
          "status": 201,
          "url": "https://api.github.com/repos/gagoar/example_repo/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
        },
      ]
    `);
    expect(github.isDone()).toBe(true);
  });
});
