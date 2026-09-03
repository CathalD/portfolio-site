/*
 * eslint.config.js — flat config.
 *
 * Kept deliberately small. Formatting is Prettier's job, not ESLint's, so
 * there are no stylistic rules here; what remains are rules that catch
 * mistakes a typechecker does not.
 */

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '.vercel/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      /* Unused variables are usually a leftover; allow a leading underscore
         for the ones that are genuinely intentional. */
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      /* `any` defeats the point of strict mode. */
      '@typescript-eslint/no-explicit-any': 'error',
      /* Astro components legitimately use non-null assertions on props that
         the schema guarantees; flag them as a warning, not an error. */
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': 'off',
    },
  },

  {
    /* The validator scripts are command-line tools: they print and exit. */
    files: ['scripts/**/*.ts'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
