import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/lib/**',
      '**/build/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.webpack/**',
      '**/jupyter_bluetooth_manager/labextension/**'
    ]
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: [
      'babel.config.js',
      'jest.config.js',
      'webpack.config.js',
      'ui-tests/**/*.js'
    ],

    languageOptions: {
      globals: globals.node
    },

    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },

  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);
