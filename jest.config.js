import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/layout.tsx',
    '!src/**/*-illustration.tsx',
    '!src/lib/bindings/**',
  ],
  coverageThreshold: {
    global: {
      // Setting to current reality to stop further degradation
      branches: 3,
      functions: 5,
      lines: 6,
      statements: 5,
    },
    // Temporary baseline until tests are written for these specific files
    './src/lib/format.ts': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
    './src/lib/parser.ts': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};

export default createJestConfig(customJestConfig);
