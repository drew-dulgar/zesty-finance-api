import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default [
  {
    files: [
      '**/*.{js,mjs,cjs,ts}'
    ]
  },
  {
    ignores: [
      'dist/'
    ]
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    },
    rules: {
      '@stylistic/ts/indent': ['warn', 2],
      '@stylistic/ts/quotes': ['warn', 'single'],
      '@stylistic/ts/comma-dangle': ['warn', 'never']
    }
  }
];