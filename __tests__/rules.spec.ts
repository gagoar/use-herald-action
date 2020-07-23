/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs';
import * as fg from 'fast-glob';

import { loadRules, getMatchingRules, composeCommentsForUsers, RuleActions } from '../src/rules';
import { mockConsole, unMockConsole } from './helpers';
import { Event } from '../src/util/constants';

import eventJSON from '../__mocks__/event.json';

jest.mock('fs');
jest.mock('fast-glob');

const event = (eventJSON as unknown) as Event;

const sync = fg.sync as jest.Mock<any>;
const readFileSync = fs.readFileSync as jest.Mock<any>;

const invalidRule = {
  customMessage: 'This is a custom message for a rule',
  users: ['@eeny', '@meeny', '@miny', '@moe'],
};

const validRule = {
  ...invalidRule,
  action: RuleActions.comment,
  includes: '*.ts',
};

describe('rules', () => {
  let consoleErrorMock: jest.Mock;
  beforeAll(() => {
    consoleErrorMock = mockConsole('error');
  });

  afterAll(() => {
    unMockConsole('error');
  });

  describe('composeCommentsForUsers', () => {
    it('uses the customMessage in the rule', () => {
      expect(
        composeCommentsForUsers([
          {
            ...validRule,
            path: '/some/rule.json',
            matches: { includes: ['/some/file.ts'] },
            teams: [],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "This is a custom message for a rule",
        ]
      `);
    });
    it('it combines 2 comments when do not have customMessage', () => {
      expect(
        composeCommentsForUsers([
          {
            ...validRule,
            customMessage: undefined,
            path: '/some/rule.json',
            matches: { includes: ['/some/file.ts'] },
            teams: [],
          },
          {
            ...validRule,
            customMessage: undefined,
            path: '/some/rule1.json',
            matches: { includes: ['/some/file.ts'] },
            teams: ['@awesomeTeam'],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "Hi there, Herald found that given these changes @eeny, @meeny, @miny, @moe, @awesomeTeam might want to take a look! 
         
          <!-- herald-use-action -->",
        ]
      `);
    });
    it('compose message', () => {
      expect(
        composeCommentsForUsers([
          {
            ...validRule,
            customMessage: undefined,
            path: '/some/rule.json',
            matches: { includes: ['/some/file.ts'] },
            teams: [],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "Hi there, Herald found that given these changes @eeny, @meeny, @miny, @moe might want to take a look! 
         
          <!-- herald-use-action -->",
        ]
      `);
    });
  });
  describe('getMatchingRules', () => {
    it('no matches', () => {
      const files = [{ filename: '/some/file.js' }];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              teams: [],
              path: '/some/rule.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot('Array []');
    });

    it('Matches includes and eventJsonPath', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              teams: [],
              eventJsonPath: '$.pull_request[?(@.login=="gagoar")].login',
              path: '/some/rule.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": "$.pull_request[?(@.login==\\"gagoar\\")].login",
            "includes": "*.ts",
            "matches": Object {
              "eventJsonPath": Array [
                "gagoar",
              ],
              "includes": Array [
                "/some/file.ts",
              ],
            },
            "path": "/some/rule.json",
            "teams": Array [],
            "users": Array [
              "@eeny",
              "@meeny",
              "@miny",
              "@moe",
            ],
          },
        ]
      `);
    });

    it('matching includes/excludes combined', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }, { filename: '/some/uglyFile.ts' }];
      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              excludes: '/some/uglyFile.ts',
              teams: [],
              path: '/some/rule.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "excludes": "/some/uglyFile.ts",
            "includes": "*.ts",
            "matches": Object {
              "includeExclude": Array [
                "/some/file.ts",
              ],
            },
            "path": "/some/rule.json",
            "teams": Array [],
            "users": Array [
              "@eeny",
              "@meeny",
              "@miny",
              "@moe",
            ],
          },
        ]
      `);
    });
    it('matching includes (and not matching another rule)', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }];
      expect(
        getMatchingRules(
          [
            { ...validRule, teams: [], path: '/some/rule.json' },
            {
              ...validRule,
              includes: 'src/*.ts',
              teams: [],
              path: '/some/ruleThatShouldNotMatch.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": "*.ts",
            "matches": Object {
              "includes": Array [
                "/some/file.ts",
              ],
            },
            "path": "/some/rule.json",
            "teams": Array [],
            "users": Array [
              "@eeny",
              "@meeny",
              "@miny",
              "@moe",
            ],
          },
        ]
      `);
    });
    it('matching includes', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }];
      expect(getMatchingRules([{ ...validRule, teams: [], path: '/some/rule.json' }], files, event))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": "*.ts",
            "matches": Object {
              "includes": Array [
                "/some/file.ts",
              ],
            },
            "path": "/some/rule.json",
            "teams": Array [],
            "users": Array [
              "@eeny",
              "@meeny",
              "@miny",
              "@moe",
            ],
          },
        ]
      `);
    });

    it('matching eventJsonPath', () => {
      const files = [{ filename: '/some/file.js' }];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              teams: [],
              eventJsonPath: '$.pull_request[?(@.login=="gagoar")].login',
              path: '/some/rule.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": "$.pull_request[?(@.login==\\"gagoar\\")].login",
            "includes": undefined,
            "matches": Object {
              "eventJsonPath": Array [
                "gagoar",
              ],
            },
            "path": "/some/rule.json",
            "teams": Array [],
            "users": Array [
              "@eeny",
              "@meeny",
              "@miny",
              "@moe",
            ],
          },
        ]
      `);
    });
  });

  describe('loadRules', () => {
    beforeEach(() => {
      sync.mockClear();
      readFileSync.mockClear();
    });
    it('invalid rule: empty array, will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue('null');

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');
      expect(consoleErrorMock).not.toHaveBeenCalled();
    });
    it("invalid rule file: file can't be parse", () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue('');

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');
      expect(consoleErrorMock).toHaveBeenCalled();
    });
    it('invalid rule will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue(JSON.stringify(invalidRule));

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');
    });
    it('loads rules successfully', () => {
      // rule coming from the rules.json  is called rawRule.
      const rawRules = {
        '/some/rule1.json': validRule,
        '/some/rule2.json': {
          ...validRule,
          teams: ['@someTeam'],
          users: undefined,
        },
        '/some/badRule.json': {
          ...validRule,
          teams: undefined,
          users: undefined,
        },
      };
      sync.mockReturnValue(Object.keys(rawRules));
      readFileSync.mockImplementation((filePath: keyof typeof rawRules) => {
        return JSON.stringify(rawRules[filePath]);
      });

      expect(loadRules('/some/*.json')).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": "*.ts",
            "name": "rule1.json",
            "path": "/some/rule1.json",
            "teams": Array [],
            "users": Array [
              "@eeny",
              "@meeny",
              "@miny",
              "@moe",
            ],
          },
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": "*.ts",
            "name": "rule2.json",
            "path": "/some/rule2.json",
            "teams": Array [
              "@someTeam",
            ],
            "users": Array [],
          },
        ]
      `);
    });
  });
});
