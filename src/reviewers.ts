import { logger } from './util/debug';
import { ActionMapInput } from '.';
import { catchHandler } from './util/catchHandler';

const debug = logger('reviewers');

// Removes leading @ and ignores the owner scope of a team
//   e.g. converts @myOrg/myTeam -> myTeam
const sanitizeTeam = (team: string) => {
  const splitTeam = team.replace('@', '').split('/');
  return splitTeam[splitTeam.length - 1];
};

export const handleReviewers: ActionMapInput = async (
  client,
  { owner, repo, prNumber, matchingRules }
): Promise<unknown> => {
  debug('handleReviewers called with:', matchingRules);

  const { reviewers, teamReviewers } = matchingRules.reduce(
    (memo, rule) => {
      const reviewers = [...memo.reviewers, ...rule.users.map((user) => user.replace('@', ''))];
      const teamReviewers = [...memo.teamReviewers, ...rule.teams.map(sanitizeTeam)];

      return { reviewers, teamReviewers };
    },
    { reviewers: [], teamReviewers: [] } as { reviewers: string[]; teamReviewers: string[] }
  );

  const result = await client.pulls
    .requestReviewers({
      owner,
      repo,
      pull_number: prNumber,
      reviewers,
      team_reviewers: teamReviewers,
    })
    .catch(catchHandler(debug));

  debug('result:', result);
  return result;
};
