import { Debugger } from 'debug';

export const catchHandler = (debug: Debugger) => (error: Error): Promise<unknown> => {
  debug('Request Failed', error);
  return Promise.reject(error);
};
