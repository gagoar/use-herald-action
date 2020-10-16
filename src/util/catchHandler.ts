import { Debugger } from 'debug';

interface HttpError extends Error {
  status: number;
}

export const catchHandler = (debug: Debugger) => (error: HttpError): Promise<unknown> => {
  if (error.status < 500) {
    debug(`Request failed with status ${error.status}, We do not consider this a fatal error`, error);
    return Promise.resolve();
  }

  debug('Request Failed', error);
  return Promise.reject(error);
};
