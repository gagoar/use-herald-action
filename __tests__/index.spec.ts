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
        "subset": Object {
          "baseSha": "f95f852bd8fca8fcc58a9a2d6c842781e32a215e",
          "headSha": "ec26c3e57ca3a959ca5aad62de7213c562f8c821",
          "owner": "gagoar",
          "prNumber": 2,
          "repo": "example_repo",
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
