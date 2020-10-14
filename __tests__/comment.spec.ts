import { composeCommentsForUsers, handleComment } from '../src/comment';
import { Octokit } from '@octokit/rest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import getCommentsResponse from '../__mocks__/scenarios/get_comments.json';
import createIssueResponse from '../__mocks__/scenarios/create_comment.json';
import { env } from '../src/environment';
jest.mock('../src/util/constants', () => {
  const constants = jest.requireActual('../src/util/constants');

  return {
    ...constants,
    maxPerPage: 2,
  };
});

describe('composeCommentsForUsers', () => {
  const invalidRule = {
    customMessage: 'This is a custom message for a rule',
    users: ['eeny', 'meeny@gmail.com', 'miny', 'moe@coursera.org'],
  };

  const validRule = {
    ...invalidRule,
    action: RuleActions.comment,
    includes: ['*.ts'],
  };
  it('uses the customMessage in the rule', () => {
    expect(
      composeCommentsForUsers([
        {
          ...validRule,
          path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
          matched: true,
          blobURL: 'MOCKED_BLOB_URL',
          teams: [],
        },
      ])
    ).toMatchInlineSnapshot(`
      Object {
        "`);
  });

  it('it combines 2 comments when do not have customMessage', () => {
    expect(
      composeCommentsForUsers([
        {
          ...validRule,
          customMessage: undefined,
          path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
          matched: true,
          blobURL: 'MOCKED_BLOB_URL',
          teams: [],
        },
        {
          ...validRule,
          customMessage: undefined,
          path: `${env.GITHUB_WORKSPACE}/some/rule1.json`,
          matched: true,
          blobURL: 'MOCKED_BLOB_URL',
          teams: ['awesomeTeam'],
        },
      ])
    ).toMatchInlineSnapshot(`
      Object {
        "_combined": "
         <details open>

         <summary> Hi there, given these changes, Herald thinks that these users should take a look! </summary>

         | Rule                               |                                  Mention                                  |
      | :--------------------------------- | :-----------------------------------------------------------------------: |
      | [some/rule.json](MOCKED_BLOB_URL)  |          @eeny<br/>meeny@gmail.com<br/>@miny<br/>moe@coursera.org         |
      | [some/rule1.json](MOCKED_BLOB_URL) | @eeny<br/>meeny@gmail.com<br/>@miny<br/>moe@coursera.org<br/>@awesomeTeam |

        </details>
        ",
      }
    `);
  });
  it('compose message', () => {
    expect(
      composeCommentsForUsers([
        {
          ...validRule,
          customMessage: undefined,
          path: `${env.GITHUB_WORKSPACE}/some/rule1.json`,
          blobURL: 'MOCKED_BLOB_URL',
          matched: true,
          teams: [],
        },
      ])
    ).toMatchInlineSnapshot(`
      Object {
        "_combined": "
         <details open>

         <summary> Hi there, given these changes, Herald thinks that these users should take a look! </summary>

         | Rule                               |                          Mention                         |
      | :--------------------------------- | :------------------------------------------------------: |
      | [some/rule1.json](MOCKED_BLOB_URL) | @eeny<br/>meeny@gmail.com<br/>@miny<br/>moe@coursera.org |

        </details>
        ",
      }
    `);
  });
});
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
      users: ['eeny', 'meeny', 'miny', 'moe'],
      includes: ['*.ts'],
      action: RuleActions.comment,
      path: 'rules/new-rule.json',
      customMessage: 'Custom message',
      teams: [],
      matched: true,
      blobURL: 'https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/rules/rule.json',
    };

    const github = nock('https://api.github.com')
      .get(`/repos/${owner}/${repo}/issues/${prIssue}/comments?page=1&per_page=2`)
      .reply(200, getCommentsResponse.slice(0, 2));

    github
      .get(`/repos/${owner}/${repo}/issues/${prIssue}/comments?page=2&per_page=2`)
      .reply(200, [getCommentsResponse[2]]);

    github.post(`/repos/${owner}/${repo}/issues/${prIssue}/comments`).reply(200, createIssueResponse);

    const response = await handleComment(client, {
      owner,
      repo,
      prNumber: 1,
      matchingRules: [rule],
      rules: [],
      sha: '',
      base: '',
      files: [],
    });

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

  it('should edit the message if it already exists', async () => {
    const rule = {
      users: ['eeny', 'meeny', 'miny', 'moe'],
      includes: ['*.ts'],
      action: RuleActions.comment,
      path: 'rules/rule.json',
      customMessage: 'Custom message',
      teams: [],
      matched: true,
      blobURL: 'https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/rules/rule.json',
    };

    nock('https://api.github.com')
      .get(`/repos/${owner}/${repo}/issues/${prIssue}/comments?page=1&per_page=2`)
      .reply(200, [getCommentsResponse[0]]);

    nock('https://api.github.com')
      .patch(`/repos/${owner}/${repo}/issues/comments/1`)
      .reply(200, [getCommentsResponse[0]]);

    const response = await handleComment(client, {
      owner,
      repo,
      prNumber: 1,
      matchingRules: [{ ...rule, customMessage: 'new comment that should be updated' }],
      base: '',
      sha: '',
      files: [],
      rules: [],
    });

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "data": Array [
            Object {
              "body": "<!-- USE_HERALD_ACTION rules/rule.json -->
      first comment",
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
          ],
          "headers": Object {
            "content-type": "application/json",
          },
          "status": 200,
          "url": "https://api.github.com/repos/gagoar/example_repo/issues/comments/1",
        },
      ]
    `);
  });
});
