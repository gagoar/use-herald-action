import { Debugger } from 'debug';
import { AllowedHttpErrors } from './constants';

interface HttpError extends Error {
  status: number;
}

export const catchHandler = (debug: Debugger) => (error: HttpError): Promise<Record<string, unknown>> => {
  if (Object.values(AllowedHttpErrors).includes(error.status)) {
    debug(`Request failed with status ${error.status}, We do not consider this a fatal error`, error);
    return Promise.resolve({});
  }

  debug('Request Failed', error);
  return Promise.reject(error);
};
