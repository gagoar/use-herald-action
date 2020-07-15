import envalid, { str, testOnly } from 'envalid';

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
