import { Debugger } from 'debug';
import { HttpErrors } from './constants';

interface HttpError extends Error {
  status: number;
}

export const catchHandler = (debug: Debugger) => (error: HttpError): Promise<unknown> => {
  if (error.status < HttpErrors.SERVER_ERROR && error.status !== HttpErrors.RESOURCE_NOT_ACCESSIBLE) {
    debug(`Request failed with status ${error.status}, We do not consider this a fatal error`, error);
    return Promise.resolve({});
  }

  debug('Request Failed', error);
  return Promise.reject(error);
};
