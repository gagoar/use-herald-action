/* eslint-disable @typescript-eslint/no-explicit-any */
import { Props } from '../src';
import { env } from '../src/environment';
import { Event, HttpErrors } from '../src/util/constants';
import * as actions from '@actions/core';
import { Main, mockedInput } from './util/helpers';
import event from '../__mocks__/event.json';
import getCommentsResponse from '../__mocks__/scenarios/get_comments.json';
import { mockCompareCommits, mockRequest } from './util/mockGitHubRequest';


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
jest.mock('@actions/github', () => {
  const workflowEvent = jest.requireActual('../__mocks__/event.json') as Event;

  return {
    context: {
      actor: workflowEvent.repository.name,
      repo: { owner: workflowEvent.repository.owner.login },
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

  const getCompareCommitsMock = () =>
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
    const compareCommitsMock = getCompareCommitsMock();
    const membershipMock = mockRequest(
      'get',
      `/orgs/${event.repository.owner.login}/teams/counting_out_game/memberships/${event.repository.name}`,
      200,
      {
        role: 'maintainer',
        state: 'active',
        url: `https://api.github.com/teams/1/memberships/${event.repository.owner.login}`,
      }
    );

    compareCommitsMock
      .get(`/repos/${login}/${name}/issues/${prIssue}/comments?page=1&per_page=100`)
      .reply(200, getCommentsResponse);

    compareCommitsMock
      .post(`/repos/${login}/${name}/issues/2/comments`)
      .replyWithError({ message: 'Resource not accessible by integration', code: HttpErrors.RESOURCE_NOT_ACCESSIBLE });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { main } = require('../src') as Main;

    await main();

    expect(setOutput).not.toHaveBeenCalled();

    expect(setFailed.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "request to https://api.github.com/repos/gagoar/example_repo/issues/2/comments failed, reason: Resource not accessible by integration",
        ],
      ]
    `);
    expect(compareCommitsMock.isDone()).toBe(true);
    expect(membershipMock.isDone()).toBe(true);
  });

});
