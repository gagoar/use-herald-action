export const maxPerPage = 100;
export const OUTPUT_NAME = 'appliedRules';
export const FILE_ENCODING = 'utf8';

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export enum SUPPORTED_EVENT_TYPES {
  PULL_REQUEST = 'pull_request',

  PULL_REQUEST_TARGET = 'pull_request_target',
  push = 'push',
}
interface Commit {
  sha: string;
}
interface Owner {
  login: string;
  id: number;
}
interface Repository {
  name: string;
  owner: Owner;
}
interface PullRequest {
  head: Commit;
  base: Commit;
  body: string;

  organization: string;
}
export interface Event {
  action: string;
  number: number;
  pull_request: PullRequest;

  repository: Repository;
}
