import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.astro'],
    plugins: { astro: astro },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      ...astro.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {},
  },
  prettier,
];
