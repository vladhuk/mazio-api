const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  extends: [
    'eslint:recommended', // Base rules
    'plugin:@typescript-eslint/eslint-recommended', // Disable base rules
    'plugin:@typescript-eslint/recommended', // Enable ts rules
    'plugin:promise/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:node/recommended-module',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],

  plugins: [
    'prettier',
    '@typescript-eslint',
    'jest',
    'promise',
    'import',
    'node',
  ],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },

  rules: {
    'prettier/prettier': [WARN],
  },
};
