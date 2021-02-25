import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

export const maxPerPage = 100;
export const OUTPUT_NAME = 'appliedRules';
export const FILE_ENCODING = 'utf8';
export const STATUS_DESCRIPTION_COPY = 'You can see the rule by clicking on Details';
export const COMBINED_TAG_KEY = '_combined';
export const LINE_BREAK = '<br/>';
export const USE_HERALD_ACTION_TAG_REGEX = /^<!-- USE_HERALD_ACTION (.*) -->$/;
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const MATCH_RULE_CONCURRENCY = 5;
export enum CommitStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export enum SUPPORTED_EVENT_TYPES {
  PULL_REQUEST = 'pull_request',

  PULL_REQUEST_TARGET = 'pull_request_target',
  push = 'push',
}

export type OctokitClient = InstanceType<typeof Octokit>;
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
export type OctokitFile = RestEndpointMethodTypes['repos']['compareCommits']['response']['data']['files'][0];

export type RuleFile = Partial<OctokitFile> & Required<Pick<OctokitFile, 'filename' | 'blob_url'>>;

export enum AllowedHttpErrors {
  UNPROCESSABLE_ENTITY = 422,
  NOT_FOUND = 404
}
export enum HttpErrors {
  RESOURCE_NOT_ACCESSIBLE = 403,
  SERVER_ERROR = 500,
}
