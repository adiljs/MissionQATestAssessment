import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'reports/cucumber-html/assets/js/**'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
      globals: {
        browser: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        expect: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tseslint, prettier },
    rules: {
      ...tseslint.configs.recommended.rules,
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],
      'prettier/prettier': 'error',
    },
  },
];
