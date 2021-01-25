/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fg from 'fast-glob';

import { RuleActions, Rules } from '../src/rules';
import { unMockConsole, mockConsole } from './util/helpers';
import { Event } from '../src/util/constants';

import eventJSON from '../__mocks__/event.json';
import alterEventJSON from '../__mocks__/event_should_work.json';
import botEventJSON from '../__mocks__/event_bot.json';
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
};

describe('rules', () => {
  const event = (eventJSON as unknown) as Event;
  const alterEvent = (alterEventJSON as unknown) as Event;
  const botEvent = (botEventJSON as unknown) as Event;

  afterAll(() => {
    unMockConsole('error');
  });

  describe('getMatchingRules', () => {
    it('no matches', async () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
      ];
      const rule = {
        ...validRule,
        includes: undefined,
        teams: [],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };
      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot('MatchingRules []');
    });

    it('Matches includes and eventJsonPath (using contains)', async () => {
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

      const rule = {
        ...validRule,
        teams: [],
        eventJsonPath: [
          '$[?(!@.body.match(/Issue Reference.+:/i))].body',
          '$[?(@.body.match(/Issue Reference.+#[0-9]+/i))].body',
        ],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, alterEvent)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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
    it('Matches includes and eventJsonPath', async () => {
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

      const rule = {
        ...validRule,
        teams: [],
        eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event, [])).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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

    it('matching includes/excludes combined', async () => {
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

      const rule = {
        ...validRule,
        excludes: ['/some/uglyFile.ts'],
        teams: [],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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
    it('matching includes (and not matching another rule)', async () => {
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

      const rule = [
        { ...validRule, teams: [], path: `${env.GITHUB_WORKSPACE}/some/rule.json` },
        {
          ...validRule,
          includes: ['src/*.ts'],
          teams: [],
          path: `${env.GITHUB_WORKSPACE}/some/ruleThatShouldNotMatch.json`,
        },
      ];

      const rules = new Rules(...rule);

      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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
    it('does not match includesInPatch (with more than one pattern)', async () => {
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

      const rule = {
        ...validRule,
        includes: undefined,
        includesInPatch: ['/noMatch/'],
        teams: [],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(
        await rules.getMatchingRules(files, event, [
          '@@ -132,7 +132,7 @@ module simon @@ -1000,7 +1000,7 @@ module gago',
          '@@ -132,7 +132,7 @@ module jon @@ -1000,7 +1000,7 @@ module heart',
        ])
      ).toMatchObject([]);
    });

    it('matching includesInPatch (with more than one pattern)', async () => {
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

      const rule = {
        ...validRule,
        includes: undefined,
        includesInPatch: ['(gag).+', '(sim).+', '/noMatch/', '*'],
        teams: [],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(
        await rules.getMatchingRules(files, event, [
          '@@ -132,7 +132,7 @@ module simon @@ -1000,7 +1000,7 @@ module gago',
          '@@ -132,7 +132,7 @@ module jon @@ -1000,7 +1000,7 @@ module heart',
        ])
      ).toMatchInlineSnapshot(`
        MatchingRules [
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
    it('matching includes (with more than one includes pattern)', async () => {
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

      const rule = {
        ...validRule,
        includes: [...validRule.includes, '*.md', '.gitignore'],
        teams: [],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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
    it('matching includes (includes as string)', async () => {
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

      const rule = { ...validRule, teams: [], path: `${env.GITHUB_WORKSPACE}/some/rule.json` };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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

    it('does matches eventJsonPath when sender.type is Bot', async () => {
      const files = [
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];

      const rule = {
        ...validRule,
        teams: [],
        eventJsonPath: ['$[?(@.type.match(/Bot/))]'],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, botEvent)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": Array [
              "$[?(@.type.match(/Bot/))]",
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
    it('does not matches eventJsonPath because includes does not match', async () => {
      const files = [
        {
          filename: '/some/file.ts',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.ts',
        },
      ];

      const rule = {
        ...validRule,
        includes: ['*.js'],
        teams: ['eeny'],
        eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event)).toMatchObject([]);
    });
    it('matches includes && eventJsonPath in the same rule', async () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
      ];

      const rule = {
        ...validRule,
        includes: ['*.js'],
        teams: ['eeny'],
        eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);

      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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
    it('matching eventJsonPath', async () => {
      const files = [
        {
          filename: '/some/file.js',
          blob_url: 'https://github.com/gagoar/example_repo/blob/ec26c3e57ca3a959ca5aad62de7213c562f8c821/some/file.js',
        },
      ];
      const rule = {
        ...validRule,
        includes: undefined,
        teams: [],
        eventJsonPath: ['$.pull_request[?(@.login=="gagoar")].login'],
        path: `${env.GITHUB_WORKSPACE}/some/rule.json`,
      };

      const rules = new Rules(rule);
      expect(await rules.getMatchingRules(files, event)).toMatchInlineSnapshot(`
        MatchingRules [
          Object {
            "action": "comment",
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

  describe('loadFromLocation', () => {
    beforeEach(() => {
      consoleErrorMock.mockClear();
      sync.mockClear();
      loadJSONFile.mockClear();
    });
    it('should load a rule when it only has JSONPath as a matcher', () => {
      const jsonRule = {
        name: 'add label when title starts with feat',
        action: 'label',
        eventJsonPath: '$..[?(@.title.match(/^feat.*?/))].title',
        labels: ['enhancement'],
      };
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockReturnValue(jsonRule);

      expect(Rules.loadFromLocation('/some/rule.json')).toMatchInlineSnapshot(`
        Rules [
          Object {
            "action": "label",
            "eventJsonPath": Array [
              "$..[?(@.title.match(/^feat.*?/))].title",
            ],
            "excludes": Array [],
            "includes": Array [],
            "includesInPatch": Array [],
            "labels": Array [
              "enhancement",
            ],
            "name": "add label when title starts with feat",
            "path": "/some/rule.json",
            "teams": Array [],
            "users": Array [],
          },
        ]
      `);
      expect(consoleErrorMock).not.toHaveBeenCalled();
    });
    it('invalid rule: empty array, will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockReturnValue('null');

      expect(Rules.loadFromLocation('/some/rule.json')).toMatchInlineSnapshot('Rules []');
      expect(consoleErrorMock).not.toHaveBeenCalled();
    });
    it("invalid rule file: file can't be parse", () => {
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockImplementationOnce(() => {
        throw new Error('file can not be parsed');
      });

      expect(Rules.loadFromLocation('/some/rule.json')).toMatchInlineSnapshot('Rules []');
      expect(consoleErrorMock).toHaveBeenCalled();
    });
    it('invalid rule will be ignored', () => {
      sync.mockReturnValue(['/some/rule.json']);
      loadJSONFile.mockReturnValue(JSON.stringify(invalidRule));

      expect(Rules.loadFromLocation('/some/rule.json')).toMatchInlineSnapshot('Rules []');
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

      expect(Rules.loadFromLocation('/some/*.json')).toMatchInlineSnapshot(`
        Rules [
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
