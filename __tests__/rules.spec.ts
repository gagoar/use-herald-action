/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs';
import * as fg from 'fast-glob';

import {
  loadRules,
  getMatchingRules,
  composeCommentsForUsers,
  RuleActions,
} from '../src/rules';
import { mockConsole, unMockConsole } from './helpers';
import { Event } from '../src/environment';

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

const validRule = { ...invalidRule, action: RuleActions.comment, glob: '*.ts' };

describe('rules', () => {
  let consoleInfoMock: jest.Mock;
  let consoleLogMock: jest.Mock;

  beforeAll(() => {
    consoleLogMock = mockConsole('log');
    consoleInfoMock = mockConsole('info');
  });

  afterAll(() => {
    unMockConsole('log');
    unMockConsole('error');
  });

  describe('composeCommentsForUsers', () => {
    it('uses the customMessage in the rule', () => {
      expect(
        composeCommentsForUsers([
          {
            ...validRule,
            path: '/some/rule.json',
            matches: { glob: ['/some/file.ts'] },
            teams: [],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "This is a custom message for a rule",
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
            matches: { glob: ['/some/file.ts'] },
            teams: [],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "Hi there, Herald found that given these changes @eeny, @meeny, @miny, @moe might want to take a look!",
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
              glob: undefined,
              teams: [],
              path: '/some/rule.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot('Array []');
    });

    it('Matches glob and eventJsonPath', () => {
      const files = [
        { filename: '/some/file.js' },
        { filename: '/some/file.ts' },
      ];

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
            "glob": "*.ts",
            "matches": Object {
              "eventJsonPath": Array [
                "gagoar",
              ],
              "glob": Array [
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

    it('matching glob', () => {
      const files = [
        { filename: '/some/file.js' },
        { filename: '/some/file.ts' },
      ];
      expect(
        getMatchingRules(
          [{ ...validRule, teams: [], path: '/some/rule.json' }],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "glob": "*.ts",
            "matches": Object {
              "glob": Array [
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
              glob: undefined,
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
            "glob": undefined,
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
      consoleInfoMock.mockClear();
      consoleLogMock.mockClear();
    });
    it('invalid rule: empty array, will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue('null');

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');

      expect(consoleLogMock.mock.calls).toMatchInlineSnapshot('Array []');
      expect(consoleInfoMock.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "found rules:",
            Array [],
          ],
        ]
      `);
    });
    it("invalid rule file: file can't be parse", () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue('');

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');

      expect(consoleLogMock.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "/some/rule.json can't be parsed, it will be ignored",
          ],
        ]
      `);
      expect(consoleInfoMock.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "found rules:",
            Array [],
          ],
        ]
      `);
    });
    it('invalid rule will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue(JSON.stringify(invalidRule));

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot('Array []');
      expect(consoleLogMock.mock.calls).toMatchInlineSnapshot('Array []');
      expect(consoleInfoMock.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "found rules:",
            Array [],
          ],
        ]
      `);
    });
    it('loads rules successfully', () => {
      // rule coming from the rules.json  is called rawRule.
      const rawRules = {
        '/some/rule1.json': { ...validRule, users: validRule.users.join(', ') },
        '/some/rule2.json': {
          ...validRule,
          teams: 'someTeams',
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
            "glob": "*.ts",
            "name": "rule1.json",
            "path": "/some/rule1.json",
            "teams": undefined,
            "users": Array [
              "@eeny",
              " @meeny",
              " @miny",
              " @moe",
            ],
          },
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "glob": "*.ts",
            "name": "rule2.json",
            "path": "/some/rule2.json",
            "teams": Array [
              "someTeams",
            ],
            "users": undefined,
          },
        ]
      `);
    });
  });
});
