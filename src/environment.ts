import envalid, { str, testOnly } from 'envalid';

export const maxPerPage = 100;
export const OUTPUT_NAME = 'appliedRules';
export const FILE_ENCODING = 'utf8';
export enum SUPPORTED_EVENT_TYPES {
  PULL_REQUEST = 'pull_request',
}
interface Head {
  sha: string;
}
interface Owner {
  login: string;
  id: number;
}
interface Repo {
  full_name: string;
  owner: Owner;
}
interface PullRequest {
  head: Head;
  repo: Repo;
  organization: string;
}
export interface Event {
  action: string;
  number: number;
  pull_request: PullRequest;
}

const environment = () =>
  envalid.cleanEnv(
    process.env,
    {
      GITHUB_EVENT_PATH: str({ devDefault: '/github/workflow/event.json' }),
      GITHUB_EVENT_NAME: str({ devDefault: 'pull_request' }),
      GITHUB_REPOSITORY: str({ devDefault: testOnly('someRepo') }),
      GITHUB_SHA: str({
        devDefault: testOnly('ffac537e6cbbf934b08745a378932722df287a53'),
      }),
    },
    { dotEnvPath: null }
  );

export const env = environment();
