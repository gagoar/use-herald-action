import { loadJSONFile } from '../src/util/loadJSONFile';
import { JSONPath } from '@astronautlabs/jsonpath';

describe('JsonPath', () => {
  it('should match excluding user but matching title', () => {
    const pattern = "$[?(@.body.match(/Issue Reference.*: #[0-9]{3}/) && @.user.login != 'renovate-bot')]";

    const event = loadJSONFile<Event>(process.env.GITHUB_EVENT_PATH);
    const result = JSONPath.query(event, pattern);

    expect(result).toMatchInlineSnapshot(`
      Array [
        "Update the README with new information.",
      ]
    `);
  });
});
