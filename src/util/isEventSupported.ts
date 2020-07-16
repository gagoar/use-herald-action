import { SUPPORTED_EVENT_TYPES } from './constants';
export const isEventSupported = (event: string): boolean => {
  return Object.values(SUPPORTED_EVENT_TYPES).some((e) => event === e);
};
