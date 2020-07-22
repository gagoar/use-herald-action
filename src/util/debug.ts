import { env } from '../environment';
import debug, { Debugger } from 'debug';

import { getInput } from '@actions/core';

const DEBUG = getInput('DEBUG') ?? false;

if (DEBUG) {
  console.log('debug is enabled, provided pattern:', DEBUG);
}
export function logger(nameSpace: string): Debugger {
  const { TASK_ID } = env;

  const log = debug(`${TASK_ID}:${nameSpace}`);
  log.log = console.log.bind(console);
  if (DEBUG) {
    log.enabled = true;
  }
  return log;
}
