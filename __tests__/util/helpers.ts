import { Props } from '../../src';

const ORIGINALS = {
  log: global.console.log,
  error: global.console.error,
  info: global.console.info,
  warn: global.console.warn,
};

type METHODS = 'log' | 'error' | 'info' | 'warn';
export const mockConsole = (method: METHODS): jest.Mock => {
  const handler = jest.fn();
  global.console[method] = handler;
  return handler;
};
export const unMockConsole = (method: METHODS): void => {
  global.console[method] = ORIGINALS[method];
};

export const mockedInput = {
  [Props.GITHUB_TOKEN]: 'TOKEN',
  [Props.dryRun]: true,
  [Props.rulesLocation]: '__mocks__/rules/*.json',
};

export type Main = { main: () => Promise<void> };
