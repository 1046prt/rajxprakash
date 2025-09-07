import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.astro'],
    plugins: { astro: astro },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json',
      },
    },
    rules: {
      ...astro.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.d.ts', 'public/scripts/**/*', 'eslint.config.js'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {},
  },
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      // Disable rules that don't make sense for declaration files
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['public/scripts/**/*'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {},
  },
  prettier,
];
