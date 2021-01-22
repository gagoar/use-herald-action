/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-var-requires */
import { Props } from '../src';
import { Event } from '../src/util/constants';
import * as actions from '@actions/core';
import { env } from '../src/environment';
import * as comment from '../src/comment';
import { mockCompareCommits } from './util/mockGitHubRequest';
import { Main, mockedInput } from './util/helpers';

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

const getGithubMock = () =>
  mockCompareCommits({
    login: event.repository.owner.login,
    name: event.repository.name,
    base: event.pull_request.base.sha,
    head: event.pull_request.head.sha,
  });

describe('use-herald-action', () => {
  beforeEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
    handleComment.mockClear();
  });
  it('should fail if rulesLocation is not present', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return key === Props.rulesLocation ? undefined : mockedInput[key];
    });

    const { main } = require('../src') as Main;

    await main();

    expect(setFailed).toHaveBeenCalled();
  });

  it('should fail if rules with errorLevel set to "error" does not match', async () => {
    const changedRulesDirectory = { ...mockedInput, [Props.rulesLocation]: '__mocks__/required_rules/*.json' };
    getInput.mockImplementation((key: Partial<keyof typeof changedRulesDirectory>) => {
      return changedRulesDirectory[key];
    });

    const github = getGithubMock();

    const { main } = require('../src') as Main;

    await main();

    expect(setFailed.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "Not all Rules with errorLevel set to error have matched. Please double check that these rules apply: rule2.json, this rules should fail because the pattern is malformed",
      ]
    `);
    expect(setOutput).not.toHaveBeenCalled();
    expect(github.isDone()).toBe(true);
  });

  it('should run normally (with dryRun: true)', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof mockedInput>) => {
      return mockedInput[key];
    });

    const github = getGithubMock();

    const { main } = require('../src') as Main;

    await main();

    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput).toHaveBeenCalled();
    expect(github.isDone()).toBe(true);
  });

  it('should run the entire action', async () => {
    const input = { ...mockedInput, [Props.dryRun]: 'false' };
    getInput.mockImplementation((key: Partial<keyof typeof input>) => {
      return input[key];
    });

    const github = getGithubMock();

    const { main } = require('../src') as Main;

    await main();

    expect(handleComment).toHaveBeenCalled();
    expect(setOutput.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "appliedRules",
          MatchingRules [
            Object {
              "action": "comment",
              "customMessage": "This is a custom message for a rule",
              "eventJsonPath": Array [],
              "excludes": Array [],
              "includes": Array [
                "*.ts",
              ],
              "includesInPatch": Array [],
              "matched": true,
              "name": "rule1.json",
              "path": "${env.GITHUB_WORKSPACE}/__mocks__/rules/rule1.json",
              "teams": Array [],
              "users": Array [
                "eeny",
                "meeny",
                "miny",
                "moe",
              ],
            },
          ],
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

    const github = getGithubMock();
    const { main } = require('../src') as Main;

    await main();

    expect(handleComment).not.toHaveBeenCalled();
    expect(setFailed.mock.calls).toMatchInlineSnapshot('Array []');
    expect(setOutput.mock.calls).toMatchSnapshot();
    expect(github.isDone()).toBe(true);
  });
});
