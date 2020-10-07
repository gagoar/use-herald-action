import nock from 'nock';

const GITHUB_URL = 'https://api.github.com';
export type CallbackRequest = (
  _uri: string,
  body: { target_url: string; description: string; state: string; context: string },
  cb: (arg0: unknown, arg1: unknown) => void
) => void;
type mockRequest = (
  action: 'post' | 'get',
  url: string,
  exitCode: number,
  response: Record<string, unknown> | Record<string, unknown>[] | CallbackRequest,
  times?: number
) => ReturnType<typeof nock>;

export const mockRequest: mockRequest = (action, url, exitCode, response, times = 1) => {
  const client = nock(GITHUB_URL)[action](url).reply(exitCode, response);

  if (times > 1) {
    for (let i = 1; i < times; i++) {
      client[action](url).reply(exitCode, response);
    }
  }

  return client;
};
