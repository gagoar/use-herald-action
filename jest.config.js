process.env.TZ = 'UTC';

module.exports = {
  globals: {
    'ts-jest': {
      disableSourceMapSupport: true,
    },
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['src/*.ts', '!./index.ts', '!src/rules.guard.ts'],
  coverageDirectory: './coverage/',
};
