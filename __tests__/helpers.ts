const ORIGINALS = {
  log: global.console.log,
  error: global.console.error,
  info: global.console.info,
};

type METHODS = 'log' | 'error' | 'info';
export const mockConsole = (method: METHODS): jest.Mock => {
  const handler = jest.fn();
  global.console[method] = handler;
  return handler;
};
export const unMockConsole = (method: METHODS): void => {
  global.console[method] = ORIGINALS[method];
};
