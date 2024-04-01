const path = require('path');

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint:recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['prettier', 'react-hooks', '@emotion'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-duplicates': 'off',
  },
  overrides: [
    {
      files: ['**/*.tsx', '**/*.jsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
      ],
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-props-no-spreading': 'off',
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
        'react/function-component-definition': [
          'error',
          { namedComponents: 'arrow-function' },
        ],
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          { variables: false },
        ],
      },
      parserOptions: {
        project: ['./tsconfig.json', './packages/**/tsconfig.json'],
      },
    },
    {
      files: ['packages/client/**/*.ts?(x)', 'packages/client/**/*.js?(x)'],
      settings: {
        'import/resolver': {
          typescript: {
            project: path.resolve(__dirname, 'packages/client/tsconfig.json'),
          },
        },
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx', 'spec.js'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
