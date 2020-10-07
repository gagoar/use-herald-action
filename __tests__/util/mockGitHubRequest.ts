import nock from 'nock';

const GITHUB_URL = 'https://api.github.com';
type mockRequest = (
  action: 'post' | 'get',
  url: string,
  exitCode: number,
  response: Record<string, unknown>
) => ReturnType<typeof nock>;

export const mockRequest: mockRequest = (action, url, exitCode, response) =>
  nock(GITHUB_URL)[action](url).reply(exitCode, response);
