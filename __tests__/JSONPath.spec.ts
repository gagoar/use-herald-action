import { loadJSONFile } from '../src/util/loadJSONFile';
import { JSONPath } from '@astronautlabs/jsonpath';
import { env } from '../src/environment';
import { Event } from '../src/util/constants';
describe('JsonPath', () => {
  it('should match excluding user but matching title', () => {
    const pattern = "$[?(@.body.match(/Issue Reference.*: #[0-9]{3}/) && @.user.login != 'renovate-bot')]";

    const event = loadJSONFile<Event>(env.GITHUB_EVENT_PATH);
    console.warn({ event, pattern });
    const result = JSONPath.query(event, pattern);

    expect(env.GITHUB_EVENT_PATH).toMatchInlineSnapshot('__mocks__/event.json');
    expect(event.pull_request.body).toMatchInlineSnapshot(`
      "This is a pretty simple change that we need to pull into master
       This is a pretty simple change that we need to pull into master (**Issue Reference**: #1234) "
    `);
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Update the README with new information.",
      ]
    `);
  });
});
