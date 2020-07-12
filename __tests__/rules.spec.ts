/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs';
import * as fg from 'fast-glob';

import {
  loadRules,
  getMatchingRules,
  composeCommentsForSubscribers,
} from '../src/rules';
import { mockConsole, unMockConsole } from './helpers';
import { Event } from '../src/environment';

import eventJSON from '../__mocks__/event.json';

jest.mock('fs');
jest.mock('fast-glob');

const event = (eventJSON as unknown) as Event;

const sync = fg.sync as jest.Mock<any>;
const readFileSync = fs.readFileSync as jest.Mock<any>;

// enum RuleAttributes {
//   subscribers = 'subscribers',
//   assignees = 'assignees',
//   glob = 'glob',
//   eventJsonPath = 'eventJsonPath',
//   customMessage = 'customMessage'
// }
const invalidRule = {
  customMessage: 'This is a custom message for a rule',
  subscribers: ['@eeny', '@meeny', '@miny', '@moe'],
};

const validRule = { ...invalidRule, glob: '*.ts' };

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

  describe('composeCommentsForSubscribers', () => {
    it('uses the customMessage in the rule', () => {
      expect(
        composeCommentsForSubscribers([
          { ...validRule, path: '/some/rule.json', matches: ['/some/file.ts'] },
        ])
      ).toMatchInlineSnapshot(`
        Array [
          "This is a custom message for a rule",
        ]
      `);
    });
    it('compose message', () => {
      expect(
        composeCommentsForSubscribers([
          {
            ...validRule,
            customMessage: undefined,
            path: '/some/rule.json',
            matches: ['/some/file.ts'],
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
          [{ ...validRule, path: '/some/rule.json' }],
          files,
          event
        )
      ).toMatchInlineSnapshot('Array []');
    });

    it('matching glob', () => {
      const files = [
        { filename: '/some/file.js' },
        { filename: '/some/file.ts' },
      ];
      expect(
        getMatchingRules(
          [{ ...validRule, path: '/some/rule.json' }],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "customMessage": "This is a custom message for a rule",
            "glob": "*.ts",
            "matches": Array [
              "/some/file.ts",
            ],
            "path": "/some/rule.json",
            "subscribers": Array [
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
              eventJsonPath: '$.pull_request[?(@.login=="Codertocat")].login',
              path: '/some/rule.json',
            },
          ],
          files,
          event
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "customMessage": "This is a custom message for a rule",
            "eventJsonPath": "$.pull_request[?(@.login==\\"Codertocat\\")].login",
            "glob": undefined,
            "matches": Array [
              "Codertocat",
            ],
            "path": "/some/rule.json",
            "subscribers": Array [
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
    it('loads rule successfully', () => {
      sync.mockReturnValue(['/some/rule.json']);
      readFileSync.mockReturnValue(JSON.stringify(validRule));

      expect(loadRules('/some/rule.json')).toMatchInlineSnapshot(`
        Array [
          Object {
            "customMessage": "This is a custom message for a rule",
            "glob": "*.ts",
            "name": "rule.json",
            "path": "/some/rule.json",
            "subscribers": Array [
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
