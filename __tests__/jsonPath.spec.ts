import JSONPath from 'jsonpath';

const event = {
  action: 'opened',
  number: 2,
  pull_request: {
    url: 'https://api.github.com/repos/gagoar/example_repo/pulls/2',
    id: 279147437,
    node_id: 'MDExOlB1bGxSZXF1ZXN0Mjc5MTQ3NDM3',
    html_url: 'https://github.com/gagoar/example_repo/pull/2',
    diff_url: 'https://github.com/gagoar/example_repo/pull/2.diff',
    patch_url: 'https://github.com/gagoar/example_repo/pull/2.patch',
    issue_url: 'https://api.github.com/repos/gagoar/example_repo/issues/2',
    number: 2,
    state: 'open',
    locked: false,
    title: 'feat: Adding a rule engine to add labels to PRs',
  },
};
describe('Testing jsonPath', () => {
  it('testing json path regex', async () => {
    const pattern = '$..[?(@.title.match(/^feat.*?/))].title';

    const result = JSONPath.query(event, pattern);

    expect(result).toMatchInlineSnapshot(`
      Array [
        "feat: Adding a rule engine to add labels to PRs",
      ]
    `);
  });
});
