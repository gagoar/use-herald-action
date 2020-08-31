import { handleReviewers } from '../src/reviewers';
import { Octokit } from '@octokit/rest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import requestedReviewersResponse from '../__mocks__/scenarios/create_requested_reviewers.json';
describe('handleReviewers', () => {
  const client = new Octokit();
  const owner = 'gagoar';
  const repo = 'example_repo';
  const prIssue = 1;
  const rule = {
    users: ['@eeny', '@meeny', '@miny', '@moe'],
    glob: '*.ts',
    action: RuleActions.review,
    path: 'rules/rule.json',
    customMessage: 'Custom message',
    teams: ['@myTeam'],
    matched: true,
  };
  beforeEach(() => {
    nock.cleanAll();
  });
  it('should add reviewers', async () => {
    const github = nock('https://api.github.com')
      .post(`/repos/${owner}/${repo}/pulls/${prIssue}/requested_reviewers`)
      .reply(201, requestedReviewersResponse);

    const response = await handleReviewers(client, owner, repo, prIssue, [rule], [], '');

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Object {
            "_links": Object {
              "comments": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/issues/1/comments",
              },
              "commits": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/1/commits",
              },
              "html": Object {
                "href": "https://github.com/gagoar/example_repo/pull/1",
              },
              "issue": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/issues/1",
              },
              "review_comment": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/comments{/number}",
              },
              "review_comments": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/1/comments",
              },
              "self": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/1",
              },
              "statuses": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
              },
            },
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
            ],
            "author_association": "OWNER",
            "base": Object {
              "label": "gagoar:master",
              "ref": "master",
              "repo": Object {
                "allow_merge_commit": true,
                "allow_rebase_merge": true,
                "allow_squash_merge": true,
                "archive_url": "http://api.github.com/repos/gagoar/example_repo/{archive_format}{/ref}",
                "archived": false,
                "assignees_url": "http://api.github.com/repos/gagoar/example_repo/assignees{/user}",
                "blobs_url": "http://api.github.com/repos/gagoar/example_repo/git/blobs{/sha}",
                "branches_url": "http://api.github.com/repos/gagoar/example_repo/branches{/branch}",
                "clone_url": "https://github.com/gagoar/example_repo.git",
                "collaborators_url": "http://api.github.com/repos/gagoar/example_repo/collaborators{/collaborator}",
                "comments_url": "http://api.github.com/repos/gagoar/example_repo/comments{/number}",
                "commits_url": "http://api.github.com/repos/gagoar/example_repo/commits{/sha}",
                "compare_url": "http://api.github.com/repos/gagoar/example_repo/compare/{base}...{head}",
                "contents_url": "http://api.github.com/repos/gagoar/example_repo/contents/{+path}",
                "contributors_url": "http://api.github.com/repos/gagoar/example_repo/contributors",
                "created_at": "2011-01-26T19:01:12Z",
                "default_branch": "master",
                "delete_branch_on_merge": true,
                "deployments_url": "http://api.github.com/repos/gagoar/example_repo/deployments",
                "description": "This your first repo!",
                "disabled": false,
                "downloads_url": "http://api.github.com/repos/gagoar/example_repo/downloads",
                "events_url": "http://api.github.com/repos/gagoar/example_repo/events",
                "fork": false,
                "forks_count": 9,
                "forks_url": "http://api.github.com/repos/gagoar/example_repo/forks",
                "full_name": "gagoar/example_repo",
                "git_commits_url": "http://api.github.com/repos/gagoar/example_repo/git/commits{/sha}",
                "git_refs_url": "http://api.github.com/repos/gagoar/example_repo/git/refs{/sha}",
                "git_tags_url": "http://api.github.com/repos/gagoar/example_repo/git/tags{/sha}",
                "git_url": "git:github.com/gagoar/example_repo.git",
                "has_downloads": true,
                "has_issues": true,
                "has_pages": false,
                "has_projects": true,
                "has_wiki": true,
                "homepage": "https://github.com",
                "hooks_url": "http://api.github.com/repos/gagoar/example_repo/hooks",
                "html_url": "https://github.com/gagoar/example_repo",
                "id": 1296269,
                "is_template": true,
                "issue_comment_url": "http://api.github.com/repos/gagoar/example_repo/issues/comments{/number}",
                "issue_events_url": "http://api.github.com/repos/gagoar/example_repo/issues/events{/number}",
                "issues_url": "http://api.github.com/repos/gagoar/example_repo/issues{/number}",
                "keys_url": "http://api.github.com/repos/gagoar/example_repo/keys{/key_id}",
                "labels_url": "http://api.github.com/repos/gagoar/example_repo/labels{/name}",
                "language": null,
                "languages_url": "http://api.github.com/repos/gagoar/example_repo/languages",
                "merges_url": "http://api.github.com/repos/gagoar/example_repo/merges",
                "milestones_url": "http://api.github.com/repos/gagoar/example_repo/milestones{/number}",
                "mirror_url": "git:git.example.com/gagoar/example_repo",
                "name": "example_repo",
                "network_count": 0,
                "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
                "notifications_url": "http://api.github.com/repos/gagoar/example_repo/notifications{?since,all,participating}",
                "open_issues_count": 0,
                "owner": Object {
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
                "permissions": Object {
                  "admin": false,
                  "pull": true,
                  "push": false,
                },
                "private": false,
                "pulls_url": "http://api.github.com/repos/gagoar/example_repo/pulls{/number}",
                "pushed_at": "2011-01-26T19:06:43Z",
                "releases_url": "http://api.github.com/repos/gagoar/example_repo/releases{/id}",
                "size": 108,
                "ssh_url": "git@github.com:gagoar/example_repo.git",
                "stargazers_count": 80,
                "stargazers_url": "http://api.github.com/repos/gagoar/example_repo/stargazers",
                "statuses_url": "http://api.github.com/repos/gagoar/example_repo/statuses/{sha}",
                "subscribers_count": 42,
                "subscribers_url": "http://api.github.com/repos/gagoar/example_repo/subscribers",
                "subscription_url": "http://api.github.com/repos/gagoar/example_repo/subscription",
                "svn_url": "https://svn.github.com/gagoar/example_repo",
                "tags_url": "http://api.github.com/repos/gagoar/example_repo/tags",
                "teams_url": "http://api.github.com/repos/gagoar/example_repo/teams",
                "temp_clone_token": "ABTLWHOULUVAXGTRYU7OC2876QJ2O",
                "template_repository": null,
                "topics": Array [
                  "gagoar",
                  "atom",
                  "electron",
                  "api",
                ],
                "trees_url": "http://api.github.com/repos/gagoar/example_repo/git/trees{/sha}",
                "updated_at": "2011-01-26T19:14:43Z",
                "url": "https://api.github.com/repos/gagoar/example_repo",
                "visibility": "public",
                "watchers_count": 80,
              },
              "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
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
            "body": "Please pull these awesome changes in!",
            "closed_at": "2011-01-26T19:01:12Z",
            "comments_url": "https://api.github.com/repos/gagoar/example_repo/issues/1/comments",
            "commits_url": "https://api.github.com/repos/gagoar/example_repo/pulls/1/commits",
            "created_at": "2011-01-26T19:01:12Z",
            "diff_url": "https://github.com/gagoar/example_repo/pull/1.diff",
            "draft": false,
            "head": Object {
              "label": "gagoar:new-topic",
              "ref": "new-topic",
              "repo": Object {
                "allow_merge_commit": true,
                "allow_rebase_merge": true,
                "allow_squash_merge": true,
                "archive_url": "http://api.github.com/repos/gagoar/example_repo/{archive_format}{/ref}",
                "archived": false,
                "assignees_url": "http://api.github.com/repos/gagoar/example_repo/assignees{/user}",
                "blobs_url": "http://api.github.com/repos/gagoar/example_repo/git/blobs{/sha}",
                "branches_url": "http://api.github.com/repos/gagoar/example_repo/branches{/branch}",
                "clone_url": "https://github.com/gagoar/example_repo.git",
                "collaborators_url": "http://api.github.com/repos/gagoar/example_repo/collaborators{/collaborator}",
                "comments_url": "http://api.github.com/repos/gagoar/example_repo/comments{/number}",
                "commits_url": "http://api.github.com/repos/gagoar/example_repo/commits{/sha}",
                "compare_url": "http://api.github.com/repos/gagoar/example_repo/compare/{base}...{head}",
                "contents_url": "http://api.github.com/repos/gagoar/example_repo/contents/{+path}",
                "contributors_url": "http://api.github.com/repos/gagoar/example_repo/contributors",
                "created_at": "2011-01-26T19:01:12Z",
                "default_branch": "master",
                "delete_branch_on_merge": true,
                "deployments_url": "http://api.github.com/repos/gagoar/example_repo/deployments",
                "description": "This your first repo!",
                "disabled": false,
                "downloads_url": "http://api.github.com/repos/gagoar/example_repo/downloads",
                "events_url": "http://api.github.com/repos/gagoar/example_repo/events",
                "fork": false,
                "forks_count": 9,
                "forks_url": "http://api.github.com/repos/gagoar/example_repo/forks",
                "full_name": "gagoar/example_repo",
                "git_commits_url": "http://api.github.com/repos/gagoar/example_repo/git/commits{/sha}",
                "git_refs_url": "http://api.github.com/repos/gagoar/example_repo/git/refs{/sha}",
                "git_tags_url": "http://api.github.com/repos/gagoar/example_repo/git/tags{/sha}",
                "git_url": "git:github.com/gagoar/example_repo.git",
                "has_downloads": true,
                "has_issues": true,
                "has_pages": false,
                "has_projects": true,
                "has_wiki": true,
                "homepage": "https://github.com",
                "hooks_url": "http://api.github.com/repos/gagoar/example_repo/hooks",
                "html_url": "https://github.com/gagoar/example_repo",
                "id": 1296269,
                "is_template": true,
                "issue_comment_url": "http://api.github.com/repos/gagoar/example_repo/issues/comments{/number}",
                "issue_events_url": "http://api.github.com/repos/gagoar/example_repo/issues/events{/number}",
                "issues_url": "http://api.github.com/repos/gagoar/example_repo/issues{/number}",
                "keys_url": "http://api.github.com/repos/gagoar/example_repo/keys{/key_id}",
                "labels_url": "http://api.github.com/repos/gagoar/example_repo/labels{/name}",
                "language": null,
                "languages_url": "http://api.github.com/repos/gagoar/example_repo/languages",
                "merges_url": "http://api.github.com/repos/gagoar/example_repo/merges",
                "milestones_url": "http://api.github.com/repos/gagoar/example_repo/milestones{/number}",
                "mirror_url": "git:git.example.com/gagoar/example_repo",
                "name": "example_repo",
                "network_count": 0,
                "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
                "notifications_url": "http://api.github.com/repos/gagoar/example_repo/notifications{?since,all,participating}",
                "open_issues_count": 0,
                "owner": Object {
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
                "permissions": Object {
                  "admin": false,
                  "pull": true,
                  "push": false,
                },
                "private": false,
                "pulls_url": "http://api.github.com/repos/gagoar/example_repo/pulls{/number}",
                "pushed_at": "2011-01-26T19:06:43Z",
                "releases_url": "http://api.github.com/repos/gagoar/example_repo/releases{/id}",
                "size": 108,
                "ssh_url": "git@github.com:gagoar/example_repo.git",
                "stargazers_count": 80,
                "stargazers_url": "http://api.github.com/repos/gagoar/example_repo/stargazers",
                "statuses_url": "http://api.github.com/repos/gagoar/example_repo/statuses/{sha}",
                "subscribers_count": 42,
                "subscribers_url": "http://api.github.com/repos/gagoar/example_repo/subscribers",
                "subscription_url": "http://api.github.com/repos/gagoar/example_repo/subscription",
                "svn_url": "https://svn.github.com/gagoar/example_repo",
                "tags_url": "http://api.github.com/repos/gagoar/example_repo/tags",
                "teams_url": "http://api.github.com/repos/gagoar/example_repo/teams",
                "temp_clone_token": "ABTLWHOULUVAXGTRYU7OC2876QJ2O",
                "template_repository": null,
                "topics": Array [
                  "gagoar",
                  "atom",
                  "electron",
                  "api",
                ],
                "trees_url": "http://api.github.com/repos/gagoar/example_repo/git/trees{/sha}",
                "updated_at": "2011-01-26T19:14:43Z",
                "url": "https://api.github.com/repos/gagoar/example_repo",
                "visibility": "public",
                "watchers_count": 80,
              },
              "sha": "6dcb09b5b57875f334f61aebed695e2e4193db5e",
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
            "html_url": "https://github.com/gagoar/example_repo/pull/1",
            "id": 1,
            "issue_url": "https://api.github.com/repos/gagoar/example_repo/issues/1",
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
            "locked": true,
            "merge_commit_sha": "e5bd3914e2e596debea16f433f57875b5b90bcd6",
            "merged_at": "2011-01-26T19:01:12Z",
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
            "node_id": "MDExOlB1bGxSZXF1ZXN0MQ==",
            "number": 1,
            "patch_url": "https://github.com/gagoar/example_repo/pull/1.patch",
            "requested_reviewers": Array [
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
            "requested_teams": Array [
              Object {
                "description": "A great team.",
                "html_url": "https://api.github.com/teams/justice-league",
                "id": 1,
                "members_url": "https://api.github.com/teams/1/members{/member}",
                "name": "Justice League",
                "node_id": "MDQ6VGVhbTE=",
                "parent": null,
                "permission": "admin",
                "privacy": "closed",
                "repositories_url": "https://api.github.com/teams/1/repos",
                "slug": "justice-league",
                "url": "https://api.github.com/teams/1",
              },
            ],
            "review_comment_url": "https://api.github.com/repos/gagoar/example_repo/pulls/comments{/number}",
            "review_comments_url": "https://api.github.com/repos/gagoar/example_repo/pulls/1/comments",
            "state": "open",
            "statuses_url": "https://api.github.com/repos/gagoar/example_repo/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
            "title": "Amazing new feature",
            "updated_at": "2011-01-26T19:01:12Z",
            "url": "https://api.github.com/repos/gagoar/example_repo/pulls/1",
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
          "url": "https://api.github.com/repos/gagoar/example_repo/pulls/1/requested_reviewers",
        },
      ]
    `);
    expect(github.isDone()).toBe(true);
  });
});
