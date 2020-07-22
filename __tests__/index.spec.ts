/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';
import { Props } from '../src';
import { Event } from '../src/util/constants';
import * as actions from '@actions/core';
import { env } from '../src/environment';
import getCompareCommitsResponse from '../__mocks__/scenarios/get_compare_commits.json';
import * as comment from '../src/comment';

jest.mock('@actions/core');
jest.mock('../src/comment');
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

const event = require(`../${env.GITHUB_EVENT_PATH}`) as Event;

const handleComment = comment.handleComment as jest.Mock<any>;
const setOutput = actions.setOutput as jest.Mock<any>;
const setFailed = actions.setFailed as jest.Mock<any>;
const getInput = actions.getInput as jest.Mock<any>;

const mockedInput = {
  [Props.GITHUB_TOKEN]: 'TOKEN',
  [Props.dryRun]: true,
  [Props.rulesLocation]: '__mocks__/rules/*.json',
};

describe('use-herald-action', () => {
  beforeEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
    handleComment.mockClear();
  });
  it('should run normally (with dryRun: true)', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return mockedInput[key];
    });

    const github = nock('https://api.github.com')
      .get(
        `/repos/${event.repository.owner.login}/${event.repository.name}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    const { main } = require('../src') as { main: Function };

    await main();

    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput).toHaveBeenCalled();
    expect(github.isDone()).toBe(true);
  });

  it('should run the entire action', async () => {
    const input = { ...mockedInput, [Props.dryRun]: false };
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return input[key];
    });

    const github = nock('https://api.github.com')
      .get(
        `/repos/${event.repository.owner.login}/${event.repository.name}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    const { main } = require('../src') as { main: Function };

    await main();

    expect(handleComment).toHaveBeenCalled();
    expect(setOutput.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "appliedRules",
          Object {
            "comment": Array [
              Object {
                "action": "comment",
                "customMessage": "This is a custom message for a rule",
                "includes": "*.ts",
                "matches": Object {
                  "includes": Array [
                    "file1.ts",
                  ],
                },
                "name": "rule1.json",
                "path": "${env.GITHUB_WORKSPACE}/__mocks__/rules/rule1.json",
                "teams": Array [],
                "users": Array [
                  "@eeny",
                  "@meeny",
                  "@miny",
                  "@moe",
                ],
              },
              Object {
                "action": "comment",
                "customMessage": "This is a custom message for a rule",
                "includes": "*.js",
                "matches": Object {
                  "includes": Array [],
                },
                "name": "The rule that only has a team",
                "path": "${env.GITHUB_WORKSPACE}/__mocks__/rules/rule2.json",
                "teams": Array [
                  "@someTeam",
                ],
                "users": Array [],
              },
            ],
          },
        ],
      ]
    `);
    expect(github.isDone()).toBe(true);
  });

  it('should run the entire action (no rules found)', async () => {
    const input = {
      ...mockedInput,
      [Props.rulesLocation]: 'someWrongDirectory',
      [Props.dryRun]: false,
    };

    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return input[key];
    });

    const github = nock('https://api.github.com')
      .get(
        `/repos/${event.repository.owner.login}/${event.repository.name}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    const { main } = require('../src') as { main: Function };

    await main();

    expect(handleComment).not.toHaveBeenCalled();
    expect(setFailed.mock.calls).toMatchInlineSnapshot('Array []');
    expect(setOutput.mock.calls).toMatchSnapshot();
    expect(github.isDone()).toBe(true);
  });
});
