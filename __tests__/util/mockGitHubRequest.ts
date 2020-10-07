import nock from 'nock';

const GITHUB_URL = 'https://api.github.com';
type mockRequest = (url: string, exitCode: number, response: Record<string, unknown>) => ReturnType<typeof nock>;
export const mockPost: mockRequest = (url, exitCode, response) => {
  return nock(GITHUB_URL).post(url).reply(exitCode, response);
};
export const mockGet: mockRequest = (url, exitCode, response) => {
  return nock(GITHUB_URL).get(url).reply(exitCode, response);
};
