/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fg from 'fast-glob';

import { loadRules, getMatchingRules, composeCommentsForUsers, RuleActions } from '../src/rules';
import { unMockConsole, mockConsole } from './helpers';
import { Event } from '../src/util/constants';

import eventJSON from '../__mocks__/event.json';
import alterEventJSON from '../__mocks__/event_should_work.json';
import * as loadJSON from '../src/util/loadJSONFile';

jest.mock('fast-glob');
jest.mock('../src/util/loadJSONFile');

const sync = fg.sync as jest.Mock<any>;
const loadJSONFile = (loadJSON.loadJSONFile as unknown) as jest.Mock<any>;

const consoleErrorMock = mockConsole('error');

const invalidRule = {
  customMessage: 'This is a custom message for a rule',
  users: ['@eeny', '@meeny', '@miny', '@moe'],
};

const validRule = {
  ...invalidRule,
  action: RuleActions.comment,
  includes: ['*.ts'],
};

describe('rules', () => {
  const event = (eventJSON as unknown) as Event;
  const alterEvent = (alterEventJSON as unknown) as Event;

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
          event,
          []
        )
      ).toMatchInlineSnapshot('Array []');
    });

    it('Matches includes and eventJsonPath (using contains)', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              teams: [],
              eventJsonPath: ['$[?(@.body.match(/Issue Reference.+#[0-9]+/))].body'],
              path: '/some/rule.json',
            },
          ],
          files,
          alterEvent,
          []
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$[?(@.body.match(/Issue Reference.+#[0-9]+/))].body",
            ],
            "includes": Array [
              "*.ts",
            ],
            "matches": Object {
              "eventJsonPath": Array [
                "<!--- write down the issue related to this  PR-->

        **Issue Reference**:  #66 

        ## Description

        adding rules to validate the PR contains an Issue Reference, so it's always linked. 

        ## Motivation and Context

        This is something that will save time when a PR is opened. 

        ## How Has This Been Tested?

        Creating this PR and editing it. given that it reacts to opened and edited. 
        some edit

        ## Checklist:
        - [x] My code follows the code style of this project.
        - [ ] My change requires a change to the documentation.
        - [ ] I have updated the documentation accordingly.
        ",
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
    it('Matches includes and eventJsonPath', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              teams: [],
              eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
              path: '/some/rule.json',
            },
          ],
          files,
          event,
          []
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$.pull_request[?(@.login==\\"gagoar\\")].login",
            ],
            "includes": Array [
              "*.ts",
            ],
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
              excludes: ['/some/uglyFile.ts'],
              teams: [],
              path: '/some/rule.json',
            },
          ],
          files,
          event,
          []
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "excludes": Array [
              "/some/uglyFile.ts",
            ],
            "includes": Array [
              "*.ts",
            ],
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
              includes: ['src/*.ts'],
              teams: [],
              path: '/some/ruleThatShouldNotMatch.json',
            },
          ],
          files,
          event,
          []
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": Array [
              "*.ts",
            ],
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
    it('matching includesInPatch (with more than one pattern)', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }, { filename: '/some/README.md' }];
      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              includesInPatch: ['(gag).+', '(sim).+', '/noMatch/', '*'],
              teams: [],
              path: '/some/rule.json',
            },
          ],
          files,
          event,
          [
            '@@ -132,7 +132,7 @@ module simon @@ -1000,7 +1000,7 @@ module gago',
            '@@ -132,7 +132,7 @@ module jon @@ -1000,7 +1000,7 @@ module heart',
          ]
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": undefined,
            "includesInPatch": Array [
              "(gag).+",
              "(sim).+",
              "/noMatch/",
              "*",
            ],
            "matches": Object {
              "includesInPatch": Array [
                "@@ -132,7 +132,7 @@ module simon @@ -1000,7 +1000,7 @@ module gago",
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
    it('matching includes (with more than one includes pattern)', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }, { filename: '/some/README.md' }];
      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: [...validRule.includes, '*.md', '.gitignore'],
              teams: [],
              path: '/some/rule.json',
            },
          ],
          files,
          event,
          []
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": Array [
              "*.ts",
              "*.md",
              ".gitignore",
            ],
            "matches": Object {
              "includes": Array [
                "/some/file.ts",
                "/some/README.md",
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
    it('matching includes (includes as string)', () => {
      const files = [{ filename: '/some/file.js' }, { filename: '/some/file.ts' }];
      expect(getMatchingRules([{ ...validRule, teams: [], path: '/some/rule.json' }], files, event, []))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "includes": Array [
              "*.ts",
            ],
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
              eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
              path: '/some/rule.json',
            },
          ],
          files,
          event,
          []
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$.pull_request[?(@.login==\\"gagoar\\")].login",
            ],
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
      consoleErrorMock.mockClear();
      sync.mockClear();
      loadJSONFile.mockClear();
    });
    it('invalid rule: empty array, will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockReturnValue('null');

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');
      expect(consoleErrorMock).not.toHaveBeenCalled();
    });
    it("invalid rule file: file can't be parse", () => {
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockImplementationOnce(() => {
        throw new Error('file can not be parsed');
      });

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');
      expect(consoleErrorMock).toHaveBeenCalled();
    });
    it('invalid rule will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockReturnValue(JSON.stringify(invalidRule));

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
        '/some/rule3.json': {
          ...validRule,
          includes: validRule.includes.join(''),
          teams: ['@someTeam'],
          users: undefined,
        },
        '/some/rule4.json': {
          ...validRule,
          includes: undefined,
          action: 'assign',
          eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
        },
        '/some/badRule.json': {
          ...validRule,
          customMessage: undefined,
          teams: undefined,
          users: undefined,
        },
      };
      sync.mockReturnValue(Object.keys(rawRules));
      loadJSONFile.mockImplementation((filePath: keyof typeof rawRules) => {
        return rawRules[filePath];
      });

      expect(loadRules('/some/*.json')).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [],
            "excludes": Array [],
            "includes": Array [
              "*.ts",
            ],
            "includesInPatch": Array [],
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
            "eventJsonPath": Array [],
            "excludes": Array [],
            "includes": Array [
              "*.ts",
            ],
            "includesInPatch": Array [],
            "name": "rule2.json",
            "path": "/some/rule2.json",
            "teams": Array [
              "@someTeam",
            ],
            "users": Array [],
          },
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [],
            "excludes": Array [],
            "includes": Array [
              "*.ts",
            ],
            "includesInPatch": Array [],
            "name": "rule3.json",
            "path": "/some/rule3.json",
            "teams": Array [
              "@someTeam",
            ],
            "users": Array [],
          },
          Object {
            "action": "assign",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$.pull_request[?(@.login==\\"gagoar\\")].login",
            ],
            "excludes": Array [],
            "includes": Array [],
            "includesInPatch": Array [],
            "name": "rule4.json",
            "path": "/some/rule4.json",
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
});
