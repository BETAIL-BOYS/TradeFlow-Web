const nextJest = require('next/jest');
const path = require('path');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  // Coverage enforcement configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/layout.tsx', // Ignores UI layout files
    '!src/**/*-illustration.tsx', // Ignores purely static asset components
    '!src/lib/bindings/**', // Ignores generated Soroban bindings
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    // Enforcing strict thresholds on math and formatting files found in src/lib/
    './src/lib/format.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    './src/lib/parser.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
