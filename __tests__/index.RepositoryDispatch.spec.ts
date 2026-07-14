/* eslint-disable @typescript-eslint/no-explicit-any */
import { Props } from '../src';
import * as actions from '@actions/core';

jest.mock('@actions/core');
jest.mock('../src/environment', () => {
  const { env } = jest.requireActual('../src/environment');

  return {
    env: {
      ...env,
      GITHUB_EVENT_PATH: '__mocks__/repository_dispatch_event.json',
      GITHUB_EVENT_NAME: 'repository_dispatch',
    },
  };
});

const setOutput = actions.setOutput as jest.Mock<any>;
const setFailed = actions.setFailed as jest.Mock<any>;
const getInput = actions.getInput as jest.Mock<any>;

const dispatchInput = {
  [Props.GITHUB_TOKEN]: 'TOKEN',
  [Props.dryRun]: true,
  [Props.rulesLocation]: '__mocks__/dispatch_rules/*.json',
};

describe('use-herald-action: repository_dispatch', () => {
  beforeEach(() => {
    getInput.mockClear();
    setFailed.mockClear();
    setOutput.mockClear();
  });

  // The fixture event has no `pull_request` field, so if main() ever tried the pull_request
  // diff path here (instead of skipping it for repository_dispatch), destructuring would throw
  // and setFailed would fire — this assertion also proves the diff step was correctly skipped.
  it('matches rules via eventJsonPath against client_payload without diffing a PR', async () => {
    getInput.mockImplementation((key: Partial<keyof typeof dispatchInput>) => dispatchInput[key]);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { main } = require('../src') as { main: () => Promise<void> };

    await main();

    expect(setFailed).not.toHaveBeenCalled();
    expect(setOutput.mock.calls[0][1]).toMatchObject([
      expect.objectContaining({ name: 'claude-review dispatch match', matched: true }),
    ]);
  });
});
