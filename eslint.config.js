const tsEslint = require("@typescript-eslint/eslint-plugin");
const eslintConfigNext = require("eslint-config-next");

module.exports = [
  // Ignore config files and generated directories from linting
  {
    ignores: [
      "*.config.{js,mjs,cjs,ts}",
      ".next/**",
      "node_modules/**",
      "tailwind.config.ts",
      "next.config.js",
    ],
  },

  // Next.js core-web-vitals configuration (flat config array)
  ...eslintConfigNext,

  // TypeScript strict type-checked rules (applied only to TS/TSX files)
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["*.config.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint,
    },
    rules: {
      // Start with strict-type-checked
      ...tsEslint.configs["strict-type-checked"].rules,

      // Downgrade no-unsafe-* to warn since many come from third-party
      // library APIs (soroban-client, axios, recharts, etc.)
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },

  // Custom rule overrides for all project files (no type-info required)
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,mts,cts}"],
    plugins: {
      "@typescript-eslint": tsEslint,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/no-unescaped-entities": "warn",
      "react-hooks/exhaustive-deps": "error",
    },
  },
];
