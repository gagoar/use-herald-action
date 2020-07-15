/* eslint-disable @typescript-eslint/no-explicit-any */
import { main } from '../src';
import * as actions from '@actions/core';

jest.mock('@actions/core');
jest.mock('../src/environment', () => ({
  env: {
    GITHUB_EVENT_NAME: 'push',
  },
}));
describe('use-herald', () => {
  const setOutput = actions.setOutput as jest.Mock<any>;
  const setFailed = actions.setFailed as jest.Mock<any>;
  it('should fail because event is not supported', async () => {
    await main();

    expect(setFailed.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          [Error: use-herald only supports pull_request events for now],
        ],
      ]
    `);
    expect(setOutput).toHaveBeenCalled();
  });
});
