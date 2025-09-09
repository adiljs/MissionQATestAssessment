import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'reports/cucumber_report.html'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
      globals: {
        ...globals.node, // provides process, Buffer, etc.
      },
    },
    plugins: { '@typescript-eslint': tseslint, prettier },
    rules: {
      ...tseslint.configs.recommended.rules,
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': 'error',
    },
  },
];
