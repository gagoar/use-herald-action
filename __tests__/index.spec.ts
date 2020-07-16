/* eslint-disable @typescript-eslint/no-explicit-any */
import { main, Props } from '../src';
import * as fs from 'fs';
import * as fg from 'fast-glob';
import * as actions from '@actions/core';
import { RuleActions } from '../src/rules';
import { Event } from '../src/util/constants';
import { env } from '../src/environment';
import nock from 'nock';
import * as comment from '../src/comment';
import getCompareCommitsResponse from '../__mocks__/scenarios/get_compare_commits.json';

import jsonEvent from '../__mocks__/event.json';
import { mockConsole } from './helpers';

jest.mock('@actions/core');
jest.mock('fs');
jest.mock('fast-glob');
jest.mock('../src/comment');
jest.mock('../src/assignees');
jest.mock('../src/reviewers');

const event = (jsonEvent as unknown) as Event;
const sync = fg.sync as jest.Mock<any>;
const getInput = actions.getInput as jest.Mock<any>;
const setOutput = actions.setOutput as jest.Mock<any>;
const setFailed = actions.setFailed as jest.Mock<any>;
const readFileSync = fs.readFileSync as jest.Mock<any>;
const handleComment = comment.handleComment as jest.Mock<any>;

describe('use-herald', () => {
  const mockedInput = {
    [Props.GITHUB_TOKEN]: 'TOKEN',
    [Props.dryRun]: true,
    [Props.rulesLocation]: './rules',
  };

  const invalidRule = {
    customMessage: 'This is a custom message for a rule',
    users: ['@eeny', '@meeny', '@miny', '@moe'],
  };

  const validRule = {
    ...invalidRule,
    action: RuleActions.comment,
    glob: '*.ts',
  };

  const rawRules = {
    '/some/rule1.json': { ...validRule, users: validRule.users.join(', ') },
    '/some/rule2.json': {
      ...validRule,
      teams: 'someTeams',
      users: undefined,
    },
    '/some/badRule.json': {
      ...validRule,
    },
  };

  const owner = 'gagoar';
  const repo = 'example_repo';

  let consoleInfoMock: jest.Mock;
  let consoleLogMock: jest.Mock;

  beforeAll(() => {
    consoleLogMock = mockConsole('log');
    consoleInfoMock = mockConsole('info');
  });
  beforeEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
    sync.mockClear();
    readFileSync.mockClear();
    consoleInfoMock.mockClear();
    consoleLogMock.mockClear();

    readFileSync.mockImplementation(
      (filePath: keyof typeof rawRules | typeof env.GITHUB_EVENT_PATH) => {
        if (
          filePath.endsWith('event.json') ||
          filePath === env.GITHUB_EVENT_PATH
        ) {
          return JSON.stringify(event);
        }
        return JSON.stringify(rawRules[filePath]);
      }
    );
  });

  beforeEach(() => {
    sync.mockReturnValue(Object.keys(rawRules));
  });
  it.only('should fail when calling github fails', async () => {
    const input = { ...mockedInput, [Props.dryRun]: false };
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return input[key];
    });

    await main();

    expect(readFileSync.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "/home/runner/work/_temp/_github_workflow/event.json",
          Object {
            "encoding": "utf8",
          },
        ],
        Array [
          "/some/rule1.json",
          Object {
            "encoding": "utf8",
          },
        ],
        Array [
          "/some/rule2.json",
          Object {
            "encoding": "utf8",
          },
        ],
        Array [
          "/some/badRule.json",
          Object {
            "encoding": "utf8",
          },
        ],
      ]
    `);
    expect(env.GITHUB_EVENT_PATH).toMatchInlineSnapshot(
      '"/home/runner/work/_temp/_github_workflow/event.json"'
    );
    expect(handleComment).not.toHaveBeenCalled();
    expect(setFailed.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          [HttpError: Bad credentials],
        ],
      ]
    `);
    expect(setOutput).not.toHaveBeenCalled();
  });

  it('should run the entire action (no rules found)', async () => {
    const input = { ...mockedInput, [Props.dryRun]: false };

    sync.mockReturnValue([]);
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return input[key];
    });

    const github = nock('https://api.github.com')
      .get(
        `/repos/${owner}/${repo}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    await main();

    expect(handleComment).not.toHaveBeenCalled();
    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput.mock.calls).toMatchSnapshot();
    expect(github.isDone()).toBe(true);
  });
  it('should run the entire action', async () => {
    const input = { ...mockedInput, [Props.dryRun]: false };
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return input[key];
    });

    const github = nock('https://api.github.com')
      .get(
        `/repos/${owner}/${repo}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    await main();

    expect(handleComment).toHaveBeenCalled();
    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput.mock.calls).toMatchSnapshot();
    expect(github.isDone()).toBe(true);
  });
  it('should not call github (dryRun: true)', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return mockedInput[key];
    });

    const github = nock('https://api.github.com')
      .get(
        `/repos/${owner}/${repo}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    await main();

    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput).toMatchSnapshot();
    expect(github.isDone()).toBe(true);
  });
});
