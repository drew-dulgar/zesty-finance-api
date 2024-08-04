import globals from 'globals';
import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default [
  { 
    languageOptions: { 
      globals: globals.node 
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['warn', 2],
      '@stylistic/js/quotes': ['warn', 'single']
    }
  },
  pluginJs.configs.recommended,

];