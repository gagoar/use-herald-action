export const maxPerPage = 100;
export const OUTPUT_NAME = 'appliedRules';
export const FILE_ENCODING = 'utf8';
export enum SUPPORTED_EVENT_TYPES {
  PULL_REQUEST = 'pull_request',
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

  organization: string;
}
export interface Event {
  action: string;
  number: number;
  pull_request: PullRequest;

  repository: Repository;
}
