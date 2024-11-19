import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: globals.node,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      jest: pluginJest,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'], // External libraries
            'internal', // Internal modules
            ['parent', 'sibling', 'index'], // Relative imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/contracts/**/*.{ts}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.test.ts'],
    languageOptions: {
      globals: {
        jest: true,
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
];
