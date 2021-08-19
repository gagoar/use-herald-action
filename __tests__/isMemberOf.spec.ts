import { Event } from '../src/util/constants';
import { handleMembership } from '../src/isMemberOf';
import { Octokit } from '@octokit/rest';

jest.mock('@actions/github', () => {
  const workflowEvent = jest.requireActual('../__mocks__/event.json') as Event;
  return {
    context: {
      actor: workflowEvent.repository.name,
      repo: { owner: workflowEvent.repository.owner.login },
    },
  };
});

describe('handleLabels', () => {
  const client = new Octokit();
  it('should not match the rule if no team si provided', async () => {
    const response = await handleMembership(client, undefined);
    expect(response).toBe(false);
  });
});
