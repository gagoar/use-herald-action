import { join } from 'path';
import envalid, { str, testOnly } from 'envalid';

const environment = () =>
  envalid.cleanEnv(
    process.env,
    {
      GITHUB_EVENT_PATH: str({
        devDefault: testOnly('__mocks__/event.json'),
      }),
      GITHUB_WORKSPACE: str({
        devDefault: testOnly(join(__dirname, '..')),
      }),
      GITHUB_EVENT_NAME: str({ devDefault: 'pull_request' }),
      GITHUB_REPOSITORY: str({ devDefault: testOnly('someRepo') }),
      GITHUB_SHA: str({
        devDefault: testOnly('ffac537e6cbbf934b08745a378932722df287a53'),
      }),
      TASK_ID: str({ default: 'use-herald-action' }),
    },
    { dotEnvPath: null }
  );

export const env = environment();
