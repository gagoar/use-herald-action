/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fg from 'fast-glob';

import { loadRules, getMatchingRules, composeCommentsForUsers, RuleActions } from '../src/rules';
import { unMockConsole, mockConsole } from './helpers';
import { Event } from '../src/util/constants';

import eventJSON from '../__mocks__/event.json';
import alterEventJSON from '../__mocks__/event_should_work.json';
import * as loadJSON from '../src/util/loadJSONFile';
import { env } from '../src/environment';

jest.mock('fast-glob');
jest.mock('../src/util/loadJSONFile');
jest.mock('../src/environment', () => {
  const { env } = jest.requireActual('../src/environment');

  return {
    env: {
      ...env,
      GITHUB_WORKSPACE: '/full/path',
    },
  };
});
const sync = fg.sync as jest.Mock<any>;
const loadJSONFile = (loadJSON.loadJSONFile as unknown) as jest.Mock<any>;

const consoleErrorMock = mockConsole('error');

const invalidRule = {
  customMessage: 'This is a custom message for a rule',
  users: ['eeny', 'meeny@gmail.com', 'miny', 'moe@coursera.org'],
};

const validRule = {
  ...invalidRule,
  action: RuleActions.comment,
  includes: ['*.ts'],
  blobURL: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/rule.json',
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
            path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            matched: true,
            blobURL: 'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
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
            path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            matched: true,
            teams: [],
          },
          {
            ...validRule,
            customMessage: undefined,
            path: `${env.GITHUB_WORKSPACE}/some/rule1.json`,
            matched: true,
            teams: ['awesomeTeam'],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "Hi there, Herald found that given these changes @eeny, meeny@gmail.com, @miny, moe@coursera.org, @awesomeTeam might want to take a look! 
         
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
            path: `${env.GITHUB_WORKSPACE}/some/rule1.json`,
            matched: true,
            teams: [],
          },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "Hi there, Herald found that given these changes @eeny, meeny@gmail.com, @miny, moe@coursera.org might want to take a look! 
         
          <!-- herald-use-action -->",
        ]
      `);
    });
  });
  describe('getMatchingRules', () => {
    it('no matches', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
      ];
      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              teams: [],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot('Array []');
    });

    it('Matches includes and eventJsonPath (using contains)', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              teams: [],
              eventJsonPath: [
                '$[?(!@.body.match(/Issue Reference.+:/i))].body',
                '$[?(@.body.match(/Issue Reference.+#[0-9]+/i))].body',
              ],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          alterEvent,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$[?(!@.body.match(/Issue Reference.+:/i))].body",
              "$[?(@.body.match(/Issue Reference.+#[0-9]+/i))].body",
            ],
            "includes": Array [
              "*.ts",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });
    it('Matches includes and eventJsonPath', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              teams: [],
              eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$.pull_request[?(@.login==\\"gagoar\\")].login",
            ],
            "includes": Array [
              "*.ts",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });

    it('matching includes/excludes combined', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
        {
          filename: '/some/uglyfile.ts',
          blob_url:
            'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/uglyfile.ts',
        },
      ];
      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              excludes: ['/some/uglyFile.ts'],
              teams: [],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "excludes": Array [
              "/some/uglyFile.ts",
            ],
            "includes": Array [
              "*.ts",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });
    it('matching includes (and not matching another rule)', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];
      expect(
        getMatchingRules(
          [
            { ...validRule, teams: [], path: `${env.GITHUB_WORKSPACE}/some/rule.json` },
            {
              ...validRule,
              includes: ['src/*.ts'],
              teams: [],
              path: `${env.GITHUB_WORKSPACE}/some/ruleThatShouldNotMatch.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "includes": Array [
              "*.ts",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });
    it('does not match includesInPatch (with more than one pattern)', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
        {
          filename: '/some/README.md',
          blob_url:
            'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/README.md',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              includesInPatch: ['/noMatch/'],
              teams: [],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [
            '@@ -132,7 +132,7 @@ module simon @@ -1000,7 +1000,7 @@ module gago',
            '@@ -132,7 +132,7 @@ module jon @@ -1000,7 +1000,7 @@ module heart',
          ],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchObject([]);
    });
    it('matching includesInPatch (with more than one pattern)', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
        {
          filename: '/some/README.md',
          blob_url:
            'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/README.md',
        },
      ];
      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              includesInPatch: ['(gag).+', '(sim).+', '/noMatch/', '*'],
              teams: [],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [
            '@@ -132,7 +132,7 @@ module simon @@ -1000,7 +1000,7 @@ module gago',
            '@@ -132,7 +132,7 @@ module jon @@ -1000,7 +1000,7 @@ module heart',
          ],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "includes": undefined,
            "includesInPatch": Array [
              "(gag).+",
              "(sim).+",
              "/noMatch/",
              "*",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });
    it('matching includes (with more than one includes pattern)', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
        {
          filename: '/some/README.md',
          blob_url:
            'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/README.md',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: [...validRule.includes, '*.md', '.gitignore'],
              teams: [],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "includes": Array [
              "*.ts",
              "*.md",
              ".gitignore",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });
    it('matching includes (includes as string)', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];
      expect(
        getMatchingRules(
          [{ ...validRule, teams: [], path: `${env.GITHUB_WORKSPACE}/some/rule.json` }],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c821',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "includes": Array [
              "*.ts",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });

    it('does not matches eventJsonPath because includes does not match', () => {
      const files = [
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: ['*.js'],
              teams: ['eeny'],
              eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchObject([]);
    });
    it('matches includes && eventJsonPath in the same rule', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: ['*.js'],
              teams: ['eeny'],
              eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$.pull_request[?(@.login==\\"gagoar\\")].login",
            ],
            "includes": Array [
              "*.js",
            ],
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [
              "eeny",
            ],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
        ]
      `);
    });
    it('matching eventJsonPath', () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
      ];

      expect(
        getMatchingRules(
          [
            {
              ...validRule,
              includes: undefined,
              teams: [],
              eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
              path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
            },
          ],
          files,
          event,
          [],
          'ec26c3e57ca3a959ca5aad62de7213c562f8c111',
          'example_repo',
          'gago'
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "comment",
            "blobURL": "https://github.com/gago/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c111/some/rule.json",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$.pull_request[?(@.login==\\"gagoar\\")].login",
            ],
            "includes": undefined,
            "matched": true,
            "path": "/full/path/some/rule.json",
            "teams": Array [],
            "users": Array [
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
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
        '/some/rule5.json': {
          ...validRule,
          action: 'label',
          users: undefined,
          teams: undefined,
          labels: ['feature-label', 'another-label'],
        },
        '/some/badRule.json': {
          ...validRule,
          customMessage: undefined,
          teams: undefined,
          users: undefined,
        },
        '/some/badLabelRule.json': {
          ...validRule,
          action: 'label',
          users: undefined,
          teams: undefined,
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
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
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
              "eeny",
              "meeny@gmail.com",
              "miny",
              "moe@coursera.org",
            ],
          },
          Object {
            "action": "label",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [],
            "excludes": Array [],
            "includes": Array [
              "*.ts",
            ],
            "includesInPatch": Array [],
            "labels": Array [
              "feature-label",
              "another-label",
            ],
            "name": "rule5.json",
            "path": "/some/rule5.json",
            "teams": Array [],
            "users": Array [],
          },
        ]
      `);
    });
  });
});
