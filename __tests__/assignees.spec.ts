import { handleAssignees } from '../src/assignees';
import { Octokit } from '@octokit/rest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import createAssigneesResponse from '../__mocks__/scenarios/create_assignees.json';
describe('handleAssignees', () => {
  const client = new Octokit();
  const owner = 'gagoar';
  const repo = 'example_repo';
  const prIssue = 1;
  const rule = {
    users: ['eeny', 'meeny', 'miny', 'moe'],
    glob: '*.ts',
    action: RuleActions.review,
    path: 'rules/rule.json',
    customMessage: 'Custom message',
    teams: [],
    matched: true,
  };
  beforeEach(() => {
    nock.cleanAll();
  });
  it('should add reviewers', async () => {
    const github = nock('https://api.github.com')
      .post(`/repos/${owner}/${repo}/issues/${prIssue}/assignees`)
      .reply(201, createAssigneesResponse);

    const response = await handleAssignees(client, owner, repo, prIssue, [rule]);

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "active_lock_reason": "too heated",
            "assignee": Object {
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
            "assignees": Array [
              Object {
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
              Object {
                "avatar_url": "https://github.com/images/error/hubot_happy.gif",
                "events_url": "https://api.github.com/users/hubot/events{/privacy}",
                "followers_url": "https://api.github.com/users/hubot/followers",
                "following_url": "https://api.github.com/users/hubot/following{/other_user}",
                "gists_url": "https://api.github.com/users/hubot/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/hubot",
                "id": 1,
                "login": "hubot",
                "node_id": "MDQ6VXNlcjE=",
                "organizations_url": "https://api.github.com/users/hubot/orgs",
                "received_events_url": "https://api.github.com/users/hubot/received_events",
                "repos_url": "https://api.github.com/users/hubot/repos",
                "site_admin": true,
                "starred_url": "https://api.github.com/users/hubot/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/hubot/subscriptions",
                "type": "User",
                "url": "https://api.github.com/users/hubot",
              },
              Object {
                "avatar_url": "https://github.com/images/error/other_user_happy.gif",
                "events_url": "https://api.github.com/users/other_user/events{/privacy}",
                "followers_url": "https://api.github.com/users/other_user/followers",
                "following_url": "https://api.github.com/users/other_user/following{/other_user}",
                "gists_url": "https://api.github.com/users/other_user/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/other_user",
                "id": 1,
                "login": "other_user",
                "node_id": "MDQ6VXNlcjE=",
                "organizations_url": "https://api.github.com/users/other_user/orgs",
                "received_events_url": "https://api.github.com/users/other_user/received_events",
                "repos_url": "https://api.github.com/users/other_user/repos",
                "site_admin": false,
                "starred_url": "https://api.github.com/users/other_user/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/other_user/subscriptions",
                "type": "User",
                "url": "https://api.github.com/users/other_user",
              },
            ],
            "body": "I'm having a problem with this.",
            "closed_at": null,
            "comments": 0,
            "comments_url": "https://api.github.com/repos/gagoar/example_repo/issues/1/comments",
            "created_at": "2011-04-22T13:33:48Z",
            "events_url": "https://api.github.com/repos/gagoar/example_repo/issues/1/events",
            "html_url": "https://github.com/gagoar/example_repo/issues/1",
            "id": 1,
            "labels": Array [
              Object {
                "color": "f29513",
                "default": true,
                "description": "Something isn't working",
                "id": 208045946,
                "name": "bug",
                "node_id": "MDU6TGFiZWwyMDgwNDU5NDY=",
                "url": "https://api.github.com/repos/gagoar/example_repo/labels/bug",
              },
            ],
            "labels_url": "https://api.github.com/repos/gagoar/example_repo/issues/1/labels{/name}",
            "locked": true,
            "milestone": Object {
              "closed_at": "2013-02-12T13:22:01Z",
              "closed_issues": 8,
              "created_at": "2011-04-10T20:09:31Z",
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
              "description": "Tracking milestone for version 1.0",
              "due_on": "2012-10-09T23:39:01Z",
              "html_url": "https://github.com/gagoar/example_repo/milestones/v1.0",
              "id": 1002604,
              "labels_url": "https://api.github.com/repos/gagoar/example_repo/milestones/1/labels",
              "node_id": "MDk6TWlsZXN0b25lMTAwMjYwNA==",
              "number": 1,
              "open_issues": 4,
              "state": "open",
              "title": "v1.0",
              "updated_at": "2014-03-03T18:58:10Z",
              "url": "https://api.github.com/repos/gagoar/example_repo/milestones/1",
            },
            "node_id": "MDU6SXNzdWUx",
            "number": 1,
            "pull_request": Object {
              "diff_url": "https://github.com/gagoar/example_repo/pull/1.diff",
              "html_url": "https://github.com/gagoar/example_repo/pull/1",
              "patch_url": "https://github.com/gagoar/example_repo/pull/1.patch",
              "url": "https://api.github.com/repos/gagoar/example_repo/pulls/1",
            },
            "repository_url": "https://api.github.com/repos/gagoar/example_repo",
            "state": "open",
            "title": "Found a bug",
            "updated_at": "2011-04-22T13:33:48Z",
            "url": "https://api.github.com/repos/gagoar/example_repo/issues/1",
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
          "status": 201,
          "url": "https://api.github.com/repos/gagoar/example_repo/issues/1/assignees",
        },
      ]
    `);
    expect(github.isDone()).toBe(true);
  });
});
