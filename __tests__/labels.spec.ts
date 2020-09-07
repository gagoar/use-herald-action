import { handleLabels } from '../src/labels';
import { Octokit } from '@octokit/rest';
import nock from 'nock';
import { RuleActions } from '../src/rules';
import createLabelsResponse from '../__mocks__/scenarios/create_labels.json';
describe('handleLabels', () => {
  const client = new Octokit();
  const owner = 'gagoar';
  const repo = 'example_repo';
  const prNumber = 1;
  const rule = {
    glob: '*.ts',
    action: RuleActions.label,
    labels: ['bug', 'enhancement'],
    path: 'rules/rule.json',
    blobURL: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/rules/rule.json',
    teams: [],
    users: [],
    matched: true,
  };
  beforeEach(() => {
    nock.cleanAll();
  });
  it('should skip the api call when no labels are provided', async () => {
    const response = await handleLabels(client, {
      owner,
      repo,
      prNumber,
      matchingRules: [{ ...rule, labels: [] }],
      rules: [],
      sha: '',
      base: '',
      files: [],
    });
    expect(response).toBe(undefined);
  });

  it('should add labels', async () => {
    const github = nock('https://api.github.com')
      .post(`/repos/${owner}/${repo}/issues/${prNumber}/labels`)
      .reply(200, createLabelsResponse);

    const response = await handleLabels(client, {
      owner,
      repo,
      prNumber,
      matchingRules: [rule],
      rules: [],
      sha: '',
      base: '',
      files: [],
    });

    expect(response).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "color": "f29513",
            "default": true,
            "description": "Something isn't working",
            "id": 208045946,
            "name": "bug",
            "node_id": "MDU6TGFiZWwyMDgwNDU5NDY=",
            "url": "https://api.github.com/repos/gagoar/example_repo/labels/bug",
          },
          Object {
            "color": "a2eeef",
            "default": false,
            "description": "New feature or request",
            "id": 208045947,
            "name": "enhancement",
            "node_id": "MDU6TGFiZWwyMDgwNDU5NDc=",
            "url": "https://api.github.com/repos/gagoar/example_repo/labels/enhancement",
          },
        ],
        "headers": Object {
          "content-type": "application/json",
        },
        "status": 200,
        "url": "https://api.github.com/repos/gagoar/example_repo/issues/1/labels",
      }
    `);
    expect(github.isDone()).toBe(true);
  });
});
