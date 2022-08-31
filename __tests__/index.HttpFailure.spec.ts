/* eslint-disable @typescript-eslint/no-explicit-any */
import { Props } from '../src';
import { env } from '../src/environment';
import { Event, HttpErrors } from '../src/util/constants';
import * as actions from '@actions/core';
import { Main, mockedInput } from './util/helpers';
import getCommentsResponse from '../__mocks__/scenarios/get_comments.json';
import { mockCompareCommits } from './util/mockGitHubRequest';

jest.mock('@actions/core');
jest.mock('../src/environment', () => {
  const { env } = jest.requireActual('../src/environment');

  return {
    env: {
      ...env,
      GITHUB_EVENT_PATH: '__mocks__/event.json',
      GITHUB_EVENT_NAME: 'pull_request',
    },
  };
});

describe('use-herald', () => {
  const getInput = actions.getInput as jest.Mock<any>;
  const setFailed = actions.setFailed as jest.Mock<any>;
  const setOutput = actions.setOutput as jest.Mock<any>;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {
    repository: {
      owner: { login },
      name,
    },
    pull_request: { base, head },
    // eslint-disable-next-line @typescript-eslint/no-var-requires
  } = require(`../${env.GITHUB_EVENT_PATH}`) as Event;

  const getGithubMock = () =>
    mockCompareCommits({
      login,
      name,
      base: base.sha,
      head: head.sha,
    });
  it('should fail action when GitHub fails', async () => {
    const input = { ...mockedInput, [Props.dryRun]: 'false' };
    getInput.mockImplementation((key: Partial<keyof typeof input>) => {
      return input[key];
    });

    const prIssue = 2;
    const github = getGithubMock();

    github
      .get(`/repos/${login}/${name}/issues/${prIssue}/comments?page=1&per_page=100`)
      .reply(200, getCommentsResponse);

    github
      .post(`/repos/${login}/${name}/statuses/${head.sha}`)
      .replyWithError({ message: 'Resource not accessible by integration', code: HttpErrors.RESOURCE_NOT_ACCESSIBLE });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { main } = require('../src') as Main;

    await main();

    expect(setOutput).not.toHaveBeenCalled();
    expect(setFailed.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "request to https://api.github.com/repos/gagoar/example_repo/statuses/ec26c3e57ca3a959ca5aad62de7213c562f8c821 failed, reason: Resource not accessible by integration",
        ],
      ]
    `);
    expect(github.isDone()).toBe(true);
  });
});
