import { handleReviewers } from '../src/reviewers';
import { Octokit } from '@octokit/rest';
import { mockRequest } from './util/mockGitHubRequest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import requestedReviewersResponse from '../__mocks__/scenarios/create_requested_reviewers.json';
import { AllowedHttpErrors } from '../src/util/constants';
describe('handleReviewers', () => {
  const client = new Octokit();
  const owner = 'gagoar';
  const repo = 'example_repo';
  const prNumber = 1;
  const rule = {
    users: ['@eeny', '@meeny', '@miny', '@moe'],
    glob: '*.ts',
    action: RuleActions.review,
    path: 'rules/rule.json',
    customMessage: 'Custom message',
    teams: ['@myTeam', '@myOrg/myOtherTeam'],
    matched: true,
    blobURL: 'https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/rules/rule.json',
  };
  const ReviewURL = `/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`;

  beforeEach(() => {
    nock.cleanAll();
  });
  it('should add reviewers', async () => {
    let requestBody = null;

    const github = nock('https://api.github.com')
      .post(ReviewURL, function (body) {
        requestBody = body;
        return body;
      })
      .reply(201, requestedReviewersResponse);

    const response = await handleReviewers(client, {
      owner,
      repo,
      prNumber,
      matchingRules: [rule],
      rules: [],
      base: '',
      sha: '',
      files: [],
    });

    expect(response).toMatchSnapshot();
    expect(requestBody).toMatchInlineSnapshot(`
      Object {
        "reviewers": Array [
          "eeny",
          "meeny",
          "miny",
          "moe",
        ],
        "team_reviewers": Array [
          "myTeam",
          "myOtherTeam",
        ],
      }
    `);
    expect(github.isDone()).toBe(true);
  });

  it('should not fail on 422 httpError', async () => {
    const github = mockRequest(
      'post',
      `/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`,
      AllowedHttpErrors.UNPROCESSABLE_ENTITY,
      () => Promise.resolve('Review cannot be requested from pull request author')
    );

    const response = await handleReviewers(client, {
      owner,
      repo,
      prNumber,
      matchingRules: [rule],
      rules: [],
      base: '',
      sha: '',
      files: [],
    });

    expect(response).toMatchInlineSnapshot('Object {}');
    expect(github.isDone()).toBe(true);
  });
});
