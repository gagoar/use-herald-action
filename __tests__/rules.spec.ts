/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'fs';
import * as fg from 'fast-glob';
import { loadRules } from '../src/rules';
import { mockConsole, unMockConsole } from './helpers';

jest.mock('fs');
jest.mock('fast-glob');

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
  customMessage: 'This is a message for an invalid rule',
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
            "customMessage": "This is a message for an invalid rule",
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
