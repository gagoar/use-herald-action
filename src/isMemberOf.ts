import github from '@actions/github';
import PQueue from 'p-queue';
import { catchHandler } from './util/catchHandler';
import { OctokitClient } from './util/constants';
import type { RestEndpointMethodTypes } from '@octokit/rest';
import { logger } from './util/debug';

const debug = logger('isMemberOf');

const ACTIVE_STATE = 'active';

type GetMembershipForUserInOrg = RestEndpointMethodTypes['teams']['getMembershipForUserInOrg']['response'];

const isGetMembershipForUserInOrg = (response: Record<string, unknown>): response is GetMembershipForUserInOrg => !!response?.data
export const handleMembership = async (
  client: OctokitClient,
  isMemberOf: string[] = [],
  requestConcurrency = 2
): Promise<boolean> => {
  const { repo, actor } = github.context;

  const queue = new PQueue({ concurrency: requestConcurrency });
  const membershipChecks = isMemberOf.map((team) => {
    return {
      org: repo.owner,
      team_slug: team,
      username: actor,
    };
  });
  debug(
    `We will check membership of ${actor} in the following teams ${membershipChecks.map(({ team_slug: team }) => team)}`
  );

  const results = await Promise.all(
    membershipChecks.map((membership) => queue.add(() => client.teams.getMembershipForUserInOrg(membership)))
  ).catch(catchHandler(debug));

  return (results as Record<string, unknown>[]).some((response: Record<string, unknown>) => {
    return isGetMembershipForUserInOrg(response) && response.data.state == ACTIVE_STATE;
  });
};
