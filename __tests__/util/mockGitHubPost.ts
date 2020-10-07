import nock from 'nock';

const GITHUB_URL = 'https://api.github.com';
export const mockPost = (url: string, exitCode: number, response: Record<string, unknown>): ReturnType<typeof nock> => {
  return nock(GITHUB_URL).post(url).reply(exitCode, response);
};
