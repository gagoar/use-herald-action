/* eslint-disable @typescript-eslint/no-explicit-any */
import { main, Props } from '../src';
import * as fs from 'fs';
import * as fg from 'fast-glob';
import * as actions from '@actions/core';
import { RuleActions } from '../src/rules';
import { env, Event } from '../src/environment';
import nock from 'nock';

import getCompareCommitsResponse from '../__mocks__/scenarios/get_compare_commits.json';

import jsonEvent from '../__mocks__/event.json';

jest.mock('@actions/core');
jest.mock('fs');
jest.mock('fast-glob');

const event = (jsonEvent as unknown) as Event;
const sync = fg.sync as jest.Mock<any>;
const getInput = actions.getInput as jest.Mock<any>;
const setOutput = actions.setOutput as jest.Mock<any>;
const setFailed = actions.setFailed as jest.Mock<any>;
const readFileSync = fs.readFileSync as jest.Mock<any>;
describe('use-herald', () => {
  const mockedInput = {
    [Props.GITHUB_TOKEN]: 'TOKEN',
    [Props.dryRun]: true,
    [Props.rulesLocation]: './rules',
  };

  afterEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
    sync.mockClear();
    readFileSync.mockClear();
  });

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

  sync.mockReturnValue(Object.keys(rawRules));
  readFileSync.mockImplementation(
    (filePath: keyof typeof rawRules | typeof env.GITHUB_EVENT_PATH) => {
      if (env.GITHUB_EVENT_PATH === filePath) {
        return JSON.stringify(event);
      }

      return JSON.stringify(rawRules[filePath]);
    }
  );

  const owner = 'gagoar';
  const repo = 'example_repo';

  it('should not call github (dryRun: true)', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return mockedInput[key];
    });
    sync.mockReturnValue(Object.keys(rawRules));

    const github = nock('https://api.github.com')
      .get(
        `/repos/${owner}/${repo}/compare/${event.pull_request.base.sha}...${event.pull_request.head.sha}`
      )
      .reply(200, getCompareCommitsResponse);

    await main();

    expect(getInput).toHaveBeenCalledTimes(Object.keys(Props).length);
    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            "appliedRules",
            Object {
              "comment": Array [
                Object {
                  "action": "comment",
                  "customMessage": "This is a custom message for a rule",
                  "glob": "*.ts",
                  "matches": Object {
                    "glob": Array [
                      "file1.ts",
                    ],
                  },
                  "name": "rule1.json",
                  "path": "/some/rule1.json",
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
                  "glob": "*.ts",
                  "matches": Object {
                    "glob": Array [
                      "file1.ts",
                    ],
                  },
                  "name": "rule2.json",
                  "path": "/some/rule2.json",
                  "teams": Array [
                    "someTeams",
                  ],
                  "users": undefined,
                },
              ],
            },
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
    expect(github.isDone()).toBe(true);
  });
});
