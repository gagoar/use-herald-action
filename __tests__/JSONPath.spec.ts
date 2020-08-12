import eventJSON from '../__mocks__/pull_request_edit.json';
import { JSONPath } from '@astronautlabs/jsonpath';

const event = (eventJSON as unknown) as Event;
describe('JsonPath', () => {
  it('should match excluding user but matching title', () => {
    const pattern = "$[?(@.body.match(/Issue Reference.*: #[0-9]{3}/) && @.user.login != 'renovate-bot')]";
    const result = JSONPath.query(event, pattern);

    expect(result).toMatchInlineSnapshot(`
      Array [
        "Update the README with new information.",
      ]
    `);
  });
});
