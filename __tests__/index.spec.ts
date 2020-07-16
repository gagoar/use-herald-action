/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';
import { Props } from '../src';
import { Event } from '../src/util/constants';
import * as actions from '@actions/core';

import jsonEvent from '../__mocks__/event.json';
import getCompareCommitsResponse from '../__mocks__/scenarios/get_compare_commits.json';
import { mockConsole } from './helpers';

jest.mock('@actions/core');

const event = (jsonEvent as unknown) as Event;
const setOutput = actions.setOutput as jest.Mock<any>;
const setFailed = actions.setFailed as jest.Mock<any>;
const getInput = actions.getInput as jest.Mock<any>;

const mockedInput = {
  [Props.GITHUB_TOKEN]: 'TOKEN',
  [Props.dryRun]: true,
  [Props.rulesLocation]: '__mocks__/rules/*.json',
};

const owner = 'gagoar';
const repo = 'example_repo';

describe('use-herald-action', () => {
  let consoleWarnMock: jest.Mock;
  let consoleInfoMock: jest.Mock;
  let consoleLogMock: jest.Mock;

  beforeAll(() => {
    consoleLogMock = mockConsole('log');
    consoleInfoMock = mockConsole('info');
    consoleWarnMock = mockConsole('warn');
  });
  beforeEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
    consoleInfoMock.mockClear();
    consoleLogMock.mockClear();
    consoleWarnMock.mockClear();
  });
  it('beta', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return mockedInput[key];
    });
    const { beta } = require('../src') as { beta: Function };

    const response = await beta();

    expect(getInput).toHaveBeenCalled();
    expect(response).toMatchInlineSnapshot(`
      Object {
        "event": Object {
          "action": "opened",
          "number": 2,
          "pull_request": Object {
            "_links": Object {
              "comments": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/issues/2/comments",
              },
              "commits": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/2/commits",
              },
              "html": Object {
                "href": "https://github.com/gagoar/example_repo/pull/2",
              },
              "issue": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/issues/2",
              },
              "review_comment": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/comments{/number}",
              },
              "review_comments": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/2/comments",
              },
              "self": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/pulls/2",
              },
              "statuses": Object {
                "href": "https://api.github.com/repos/gagoar/example_repo/statuses/ec26c3e57ca3a959ca5aad62de7213c562f8c821",
              },
            },
            "additions": 1,
            "assignee": null,
            "assignees": Array [],
            "author_association": "OWNER",
            "base": Object {
              "label": "gagoar:master",
              "ref": "master",
              "repo": Object {
                "archive_url": "https://api.github.com/repos/gagoar/example_repo/{archive_format}{/ref}",
                "archived": false,
                "assignees_url": "https://api.github.com/repos/gagoar/example_repo/assignees{/user}",
                "blobs_url": "https://api.github.com/repos/gagoar/example_repo/git/blobs{/sha}",
                "branches_url": "https://api.github.com/repos/gagoar/example_repo/branches{/branch}",
                "clone_url": "https://github.com/gagoar/example_repo.git",
                "collaborators_url": "https://api.github.com/repos/gagoar/example_repo/collaborators{/collaborator}",
                "comments_url": "https://api.github.com/repos/gagoar/example_repo/comments{/number}",
                "commits_url": "https://api.github.com/repos/gagoar/example_repo/commits{/sha}",
                "compare_url": "https://api.github.com/repos/gagoar/example_repo/compare/{base}...{head}",
                "contents_url": "https://api.github.com/repos/gagoar/example_repo/contents/{+path}",
                "contributors_url": "https://api.github.com/repos/gagoar/example_repo/contributors",
                "created_at": "2019-05-15T15:19:25Z",
                "default_branch": "master",
                "deployments_url": "https://api.github.com/repos/gagoar/example_repo/deployments",
                "description": null,
                "disabled": false,
                "downloads_url": "https://api.github.com/repos/gagoar/example_repo/downloads",
                "events_url": "https://api.github.com/repos/gagoar/example_repo/events",
                "fork": false,
                "forks": 0,
                "forks_count": 0,
                "forks_url": "https://api.github.com/repos/gagoar/example_repo/forks",
                "full_name": "gagoar/example_repo",
                "git_commits_url": "https://api.github.com/repos/gagoar/example_repo/git/commits{/sha}",
                "git_refs_url": "https://api.github.com/repos/gagoar/example_repo/git/refs{/sha}",
                "git_tags_url": "https://api.github.com/repos/gagoar/example_repo/git/tags{/sha}",
                "git_url": "git://github.com/gagoar/example_repo.git",
                "has_downloads": true,
                "has_issues": true,
                "has_pages": true,
                "has_projects": true,
                "has_wiki": true,
                "homepage": null,
                "hooks_url": "https://api.github.com/repos/gagoar/example_repo/hooks",
                "html_url": "https://github.com/gagoar/example_repo",
                "id": 186853002,
                "issue_comment_url": "https://api.github.com/repos/gagoar/example_repo/issues/comments{/number}",
                "issue_events_url": "https://api.github.com/repos/gagoar/example_repo/issues/events{/number}",
                "issues_url": "https://api.github.com/repos/gagoar/example_repo/issues{/number}",
                "keys_url": "https://api.github.com/repos/gagoar/example_repo/keys{/key_id}",
                "labels_url": "https://api.github.com/repos/gagoar/example_repo/labels{/name}",
                "language": null,
                "languages_url": "https://api.github.com/repos/gagoar/example_repo/languages",
                "license": null,
                "merges_url": "https://api.github.com/repos/gagoar/example_repo/merges",
                "milestones_url": "https://api.github.com/repos/gagoar/example_repo/milestones{/number}",
                "mirror_url": null,
                "name": "example_repo",
                "node_id": "MDEwOlJlcG9zaXRvcnkxODY4NTMwMDI=",
                "notifications_url": "https://api.github.com/repos/gagoar/example_repo/notifications{?since,all,participating}",
                "open_issues": 2,
                "open_issues_count": 2,
                "owner": Object {
                  "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
                  "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
                  "followers_url": "https://api.github.com/users/gagoar/followers",
                  "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
                  "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
                  "gravatar_id": "",
                  "html_url": "https://github.com/gagoar",
                  "id": 21031067,
                  "login": "gagoar",
                  "node_id": "MDQ6VXNlcjIxMDMxMDY3",
                  "organizations_url": "https://api.github.com/users/gagoar/orgs",
                  "received_events_url": "https://api.github.com/users/gagoar/received_events",
                  "repos_url": "https://api.github.com/users/gagoar/repos",
                  "site_admin": false,
                  "starred_url": "https://api.github.com/users/gagoar/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/gagoar/subscriptions",
                  "type": "User",
                  "url": "https://api.github.com/users/gagoar",
                },
                "private": false,
                "pulls_url": "https://api.github.com/repos/gagoar/example_repo/pulls{/number}",
                "pushed_at": "2019-05-15T15:20:32Z",
                "releases_url": "https://api.github.com/repos/gagoar/example_repo/releases{/id}",
                "size": 0,
                "ssh_url": "git@github.com:gagoar/example_repo.git",
                "stargazers_count": 0,
                "stargazers_url": "https://api.github.com/repos/gagoar/example_repo/stargazers",
                "statuses_url": "https://api.github.com/repos/gagoar/example_repo/statuses/{sha}",
                "subscribers_url": "https://api.github.com/repos/gagoar/example_repo/subscribers",
                "subscription_url": "https://api.github.com/repos/gagoar/example_repo/subscription",
                "svn_url": "https://github.com/gagoar/example_repo",
                "tags_url": "https://api.github.com/repos/gagoar/example_repo/tags",
                "teams_url": "https://api.github.com/repos/gagoar/example_repo/teams",
                "trees_url": "https://api.github.com/repos/gagoar/example_repo/git/trees{/sha}",
                "updated_at": "2019-05-15T15:19:27Z",
                "url": "https://api.github.com/repos/gagoar/example_repo",
                "watchers": 0,
                "watchers_count": 0,
              },
              "sha": "f95f852bd8fca8fcc58a9a2d6c842781e32a215e",
              "user": Object {
                "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
                "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
                "followers_url": "https://api.github.com/users/gagoar/followers",
                "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
                "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/gagoar",
                "id": 21031067,
                "login": "gagoar",
                "node_id": "MDQ6VXNlcjIxMDMxMDY3",
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
            "body": "This is a pretty simple change that we need to pull into master.",
            "changed_files": 1,
            "closed_at": null,
            "comments": 0,
            "comments_url": "https://api.github.com/repos/gagoar/example_repo/issues/2/comments",
            "commits": 1,
            "commits_url": "https://api.github.com/repos/gagoar/example_repo/pulls/2/commits",
            "created_at": "2019-05-15T15:20:33Z",
            "deletions": 1,
            "diff_url": "https://github.com/gagoar/example_repo/pull/2.diff",
            "draft": false,
            "head": Object {
              "label": "gagoar:changes",
              "ref": "changes",
              "repo": Object {
                "archive_url": "https://api.github.com/repos/gagoar/example_repo/{archive_format}{/ref}",
                "archived": false,
                "assignees_url": "https://api.github.com/repos/gagoar/example_repo/assignees{/user}",
                "blobs_url": "https://api.github.com/repos/gagoar/example_repo/git/blobs{/sha}",
                "branches_url": "https://api.github.com/repos/gagoar/example_repo/branches{/branch}",
                "clone_url": "https://github.com/gagoar/example_repo.git",
                "collaborators_url": "https://api.github.com/repos/gagoar/example_repo/collaborators{/collaborator}",
                "comments_url": "https://api.github.com/repos/gagoar/example_repo/comments{/number}",
                "commits_url": "https://api.github.com/repos/gagoar/example_repo/commits{/sha}",
                "compare_url": "https://api.github.com/repos/gagoar/example_repo/compare/{base}...{head}",
                "contents_url": "https://api.github.com/repos/gagoar/example_repo/contents/{+path}",
                "contributors_url": "https://api.github.com/repos/gagoar/example_repo/contributors",
                "created_at": "2019-05-15T15:19:25Z",
                "default_branch": "master",
                "deployments_url": "https://api.github.com/repos/gagoar/example_repo/deployments",
                "description": null,
                "disabled": false,
                "downloads_url": "https://api.github.com/repos/gagoar/example_repo/downloads",
                "events_url": "https://api.github.com/repos/gagoar/example_repo/events",
                "fork": false,
                "forks": 0,
                "forks_count": 0,
                "forks_url": "https://api.github.com/repos/gagoar/example_repo/forks",
                "full_name": "gagoar/example_repo",
                "git_commits_url": "https://api.github.com/repos/gagoar/example_repo/git/commits{/sha}",
                "git_refs_url": "https://api.github.com/repos/gagoar/example_repo/git/refs{/sha}",
                "git_tags_url": "https://api.github.com/repos/gagoar/example_repo/git/tags{/sha}",
                "git_url": "git://github.com/gagoar/example_repo.git",
                "has_downloads": true,
                "has_issues": true,
                "has_pages": true,
                "has_projects": true,
                "has_wiki": true,
                "homepage": null,
                "hooks_url": "https://api.github.com/repos/gagoar/example_repo/hooks",
                "html_url": "https://github.com/gagoar/example_repo",
                "id": 186853002,
                "issue_comment_url": "https://api.github.com/repos/gagoar/example_repo/issues/comments{/number}",
                "issue_events_url": "https://api.github.com/repos/gagoar/example_repo/issues/events{/number}",
                "issues_url": "https://api.github.com/repos/gagoar/example_repo/issues{/number}",
                "keys_url": "https://api.github.com/repos/gagoar/example_repo/keys{/key_id}",
                "labels_url": "https://api.github.com/repos/gagoar/example_repo/labels{/name}",
                "language": null,
                "languages_url": "https://api.github.com/repos/gagoar/example_repo/languages",
                "license": null,
                "merges_url": "https://api.github.com/repos/gagoar/example_repo/merges",
                "milestones_url": "https://api.github.com/repos/gagoar/example_repo/milestones{/number}",
                "mirror_url": null,
                "name": "example_repo",
                "node_id": "MDEwOlJlcG9zaXRvcnkxODY4NTMwMDI=",
                "notifications_url": "https://api.github.com/repos/gagoar/example_repo/notifications{?since,all,participating}",
                "open_issues": 2,
                "open_issues_count": 2,
                "owner": Object {
                  "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
                  "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
                  "followers_url": "https://api.github.com/users/gagoar/followers",
                  "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
                  "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
                  "gravatar_id": "",
                  "html_url": "https://github.com/gagoar",
                  "id": 21031067,
                  "login": "gagoar",
                  "node_id": "MDQ6VXNlcjIxMDMxMDY3",
                  "organizations_url": "https://api.github.com/users/gagoar/orgs",
                  "received_events_url": "https://api.github.com/users/gagoar/received_events",
                  "repos_url": "https://api.github.com/users/gagoar/repos",
                  "site_admin": false,
                  "starred_url": "https://api.github.com/users/gagoar/starred{/owner}{/repo}",
                  "subscriptions_url": "https://api.github.com/users/gagoar/subscriptions",
                  "type": "User",
                  "url": "https://api.github.com/users/gagoar",
                },
                "private": false,
                "pulls_url": "https://api.github.com/repos/gagoar/example_repo/pulls{/number}",
                "pushed_at": "2019-05-15T15:20:32Z",
                "releases_url": "https://api.github.com/repos/gagoar/example_repo/releases{/id}",
                "size": 0,
                "ssh_url": "git@github.com:gagoar/example_repo.git",
                "stargazers_count": 0,
                "stargazers_url": "https://api.github.com/repos/gagoar/example_repo/stargazers",
                "statuses_url": "https://api.github.com/repos/gagoar/example_repo/statuses/{sha}",
                "subscribers_url": "https://api.github.com/repos/gagoar/example_repo/subscribers",
                "subscription_url": "https://api.github.com/repos/gagoar/example_repo/subscription",
                "svn_url": "https://github.com/gagoar/example_repo",
                "tags_url": "https://api.github.com/repos/gagoar/example_repo/tags",
                "teams_url": "https://api.github.com/repos/gagoar/example_repo/teams",
                "trees_url": "https://api.github.com/repos/gagoar/example_repo/git/trees{/sha}",
                "updated_at": "2019-05-15T15:19:27Z",
                "url": "https://api.github.com/repos/gagoar/example_repo",
                "watchers": 0,
                "watchers_count": 0,
              },
              "sha": "ec26c3e57ca3a959ca5aad62de7213c562f8c821",
              "user": Object {
                "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
                "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
                "followers_url": "https://api.github.com/users/gagoar/followers",
                "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
                "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
                "gravatar_id": "",
                "html_url": "https://github.com/gagoar",
                "id": 21031067,
                "login": "gagoar",
                "node_id": "MDQ6VXNlcjIxMDMxMDY3",
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
            "html_url": "https://github.com/gagoar/example_repo/pull/2",
            "id": 279147437,
            "issue_url": "https://api.github.com/repos/gagoar/example_repo/issues/2",
            "labels": Array [],
            "locked": false,
            "maintainer_can_modify": false,
            "merge_commit_sha": null,
            "mergeable": null,
            "mergeable_state": "unknown",
            "merged": false,
            "merged_at": null,
            "merged_by": null,
            "milestone": null,
            "node_id": "MDExOlB1bGxSZXF1ZXN0Mjc5MTQ3NDM3",
            "number": 2,
            "patch_url": "https://github.com/gagoar/example_repo/pull/2.patch",
            "rebaseable": null,
            "requested_reviewers": Array [],
            "requested_teams": Array [],
            "review_comment_url": "https://api.github.com/repos/gagoar/example_repo/pulls/comments{/number}",
            "review_comments": 0,
            "review_comments_url": "https://api.github.com/repos/gagoar/example_repo/pulls/2/comments",
            "state": "open",
            "statuses_url": "https://api.github.com/repos/gagoar/example_repo/statuses/ec26c3e57ca3a959ca5aad62de7213c562f8c821",
            "title": "Update the README with new information.",
            "updated_at": "2019-05-15T15:20:33Z",
            "url": "https://api.github.com/repos/gagoar/example_repo/pulls/2",
            "user": Object {
              "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
              "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
              "followers_url": "https://api.github.com/users/gagoar/followers",
              "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
              "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
              "gravatar_id": "",
              "html_url": "https://github.com/gagoar",
              "id": 21031067,
              "login": "gagoar",
              "node_id": "MDQ6VXNlcjIxMDMxMDY3",
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
          "repository": Object {
            "archive_url": "https://api.github.com/repos/gagoar/example_repo/{archive_format}{/ref}",
            "archived": false,
            "assignees_url": "https://api.github.com/repos/gagoar/example_repo/assignees{/user}",
            "blobs_url": "https://api.github.com/repos/gagoar/example_repo/git/blobs{/sha}",
            "branches_url": "https://api.github.com/repos/gagoar/example_repo/branches{/branch}",
            "clone_url": "https://github.com/gagoar/example_repo.git",
            "collaborators_url": "https://api.github.com/repos/gagoar/example_repo/collaborators{/collaborator}",
            "comments_url": "https://api.github.com/repos/gagoar/example_repo/comments{/number}",
            "commits_url": "https://api.github.com/repos/gagoar/example_repo/commits{/sha}",
            "compare_url": "https://api.github.com/repos/gagoar/example_repo/compare/{base}...{head}",
            "contents_url": "https://api.github.com/repos/gagoar/example_repo/contents/{+path}",
            "contributors_url": "https://api.github.com/repos/gagoar/example_repo/contributors",
            "created_at": "2019-05-15T15:19:25Z",
            "default_branch": "master",
            "deployments_url": "https://api.github.com/repos/gagoar/example_repo/deployments",
            "description": null,
            "disabled": false,
            "downloads_url": "https://api.github.com/repos/gagoar/example_repo/downloads",
            "events_url": "https://api.github.com/repos/gagoar/example_repo/events",
            "fork": false,
            "forks": 0,
            "forks_count": 0,
            "forks_url": "https://api.github.com/repos/gagoar/example_repo/forks",
            "full_name": "gagoar/example_repo",
            "git_commits_url": "https://api.github.com/repos/gagoar/example_repo/git/commits{/sha}",
            "git_refs_url": "https://api.github.com/repos/gagoar/example_repo/git/refs{/sha}",
            "git_tags_url": "https://api.github.com/repos/gagoar/example_repo/git/tags{/sha}",
            "git_url": "git://github.com/gagoar/example_repo.git",
            "has_downloads": true,
            "has_issues": true,
            "has_pages": true,
            "has_projects": true,
            "has_wiki": true,
            "homepage": null,
            "hooks_url": "https://api.github.com/repos/gagoar/example_repo/hooks",
            "html_url": "https://github.com/gagoar/example_repo",
            "id": 186853002,
            "issue_comment_url": "https://api.github.com/repos/gagoar/example_repo/issues/comments{/number}",
            "issue_events_url": "https://api.github.com/repos/gagoar/example_repo/issues/events{/number}",
            "issues_url": "https://api.github.com/repos/gagoar/example_repo/issues{/number}",
            "keys_url": "https://api.github.com/repos/gagoar/example_repo/keys{/key_id}",
            "labels_url": "https://api.github.com/repos/gagoar/example_repo/labels{/name}",
            "language": null,
            "languages_url": "https://api.github.com/repos/gagoar/example_repo/languages",
            "license": null,
            "merges_url": "https://api.github.com/repos/gagoar/example_repo/merges",
            "milestones_url": "https://api.github.com/repos/gagoar/example_repo/milestones{/number}",
            "mirror_url": null,
            "name": "example_repo",
            "node_id": "MDEwOlJlcG9zaXRvcnkxODY4NTMwMDI=",
            "notifications_url": "https://api.github.com/repos/gagoar/example_repo/notifications{?since,all,participating}",
            "open_issues": 2,
            "open_issues_count": 2,
            "owner": Object {
              "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
              "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
              "followers_url": "https://api.github.com/users/gagoar/followers",
              "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
              "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
              "gravatar_id": "",
              "html_url": "https://github.com/gagoar",
              "id": 21031067,
              "login": "gagoar",
              "node_id": "MDQ6VXNlcjIxMDMxMDY3",
              "organizations_url": "https://api.github.com/users/gagoar/orgs",
              "received_events_url": "https://api.github.com/users/gagoar/received_events",
              "repos_url": "https://api.github.com/users/gagoar/repos",
              "site_admin": false,
              "starred_url": "https://api.github.com/users/gagoar/starred{/owner}{/repo}",
              "subscriptions_url": "https://api.github.com/users/gagoar/subscriptions",
              "type": "User",
              "url": "https://api.github.com/users/gagoar",
            },
            "private": false,
            "pulls_url": "https://api.github.com/repos/gagoar/example_repo/pulls{/number}",
            "pushed_at": "2019-05-15T15:20:32Z",
            "releases_url": "https://api.github.com/repos/gagoar/example_repo/releases{/id}",
            "size": 0,
            "ssh_url": "git@github.com:gagoar/example_repo.git",
            "stargazers_count": 0,
            "stargazers_url": "https://api.github.com/repos/gagoar/example_repo/stargazers",
            "statuses_url": "https://api.github.com/repos/gagoar/example_repo/statuses/{sha}",
            "subscribers_url": "https://api.github.com/repos/gagoar/example_repo/subscribers",
            "subscription_url": "https://api.github.com/repos/gagoar/example_repo/subscription",
            "svn_url": "https://github.com/gagoar/example_repo",
            "tags_url": "https://api.github.com/repos/gagoar/example_repo/tags",
            "teams_url": "https://api.github.com/repos/gagoar/example_repo/teams",
            "trees_url": "https://api.github.com/repos/gagoar/example_repo/git/trees{/sha}",
            "updated_at": "2019-05-15T15:19:27Z",
            "url": "https://api.github.com/repos/gagoar/example_repo",
            "watchers": 0,
            "watchers_count": 0,
          },
          "sender": Object {
            "avatar_url": "https://avatars1.githubusercontent.com/u/21031067?v=4",
            "events_url": "https://api.github.com/users/gagoar/events{/privacy}",
            "followers_url": "https://api.github.com/users/gagoar/followers",
            "following_url": "https://api.github.com/users/gagoar/following{/other_user}",
            "gists_url": "https://api.github.com/users/gagoar/gists{/gist_id}",
            "gravatar_id": "",
            "html_url": "https://github.com/gagoar",
            "id": 21031067,
            "login": "gagoar",
            "node_id": "MDQ6VXNlcjIxMDMxMDY3",
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
        "response": Object {
          "dir": "/Users/gfrigerio/base/use-herald/",
          "params": Object {
            "GITHUB_TOKEN": "TOKEN",
            "dryRun": true,
            "rulesLocation": "__mocks__/rules/*.json",
          },
          "rules": Array [
            Object {
              "action": "comment",
              "customMessage": "This is a custom message for a rule",
              "glob": "*.ts",
              "name": "rule1.json",
              "path": "/Users/gfrigerio/base/use-herald/__mocks__/rules/rule1.json",
              "teams": undefined,
              "users": Array [
                "@eeny",
                " @meeny",
                " @miny",
                " @moe",
              ],
            },
            Object {
              "action": "comment",
              "customMessage": "This is a custom message for a rule",
              "glob": "*.js",
              "name": "The rule that only has a team",
              "path": "/Users/gfrigerio/base/use-herald/__mocks__/rules/rule2.json",
              "teams": Array [
                "@someTeam",
              ],
              "users": undefined,
            },
          ],
        },
      }
    `);
  });
  it.skip('should run normally (with dryRun: true)', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return mockedInput[key];
    });
    const github = nock('https://api.github.com')
      .get(
        `/repos/${owner}/${repo}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    const { main } = require('../src') as { main: Function };

    await main();

    expect(consoleWarnMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "rulesLocation": "__mocks__/rules/*.json",
            "workspace": "/Users/gfrigerio/base/use-herald/",
          },
        ],
        Array [
          Object {
            "dir": "/Users/gfrigerio/base/use-herald/",
            "rules": Array [
              Object {
                "action": "comment",
                "customMessage": "This is a custom message for a rule",
                "glob": "*.ts",
                "name": "rule1.json",
                "path": "/Users/gfrigerio/base/use-herald/__mocks__/rules/rule1.json",
                "teams": undefined,
                "users": Array [
                  "@eeny",
                  " @meeny",
                  " @miny",
                  " @moe",
                ],
              },
              Object {
                "action": "comment",
                "customMessage": "This is a custom message for a rule",
                "glob": "*.js",
                "name": "The rule that only has a team",
                "path": "/Users/gfrigerio/base/use-herald/__mocks__/rules/rule2.json",
                "teams": Array [
                  "@someTeam",
                ],
                "users": undefined,
              },
            ],
            "rulesLocation": "__mocks__/rules/*.json",
          },
        ],
      ]
    `);
    expect(consoleInfoMock.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "found rules:",
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "glob": "*.ts",
            "name": "rule1.json",
            "path": "/Users/gfrigerio/base/use-herald/__mocks__/rules/rule1.json",
            "teams": undefined,
            "users": Array [
              "@eeny",
              " @meeny",
              " @miny",
              " @moe",
            ],
          },
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "glob": "*.js",
            "name": "The rule that only has a team",
            "path": "/Users/gfrigerio/base/use-herald/__mocks__/rules/rule2.json",
            "teams": Array [
              "@someTeam",
            ],
            "users": undefined,
          },
        ],
      ]
    `);
    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput).toHaveBeenCalled();
    expect(github.isDone()).toBe(true);
  });
});
