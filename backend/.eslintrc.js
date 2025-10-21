module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'jest'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    'plugin:jest/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    '**/dist/**',
    '**/tmp/**',
    '**/node_modules/**',
    '**/.stryker-tmp/**',
    '**/scripts/**',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['tsconfig.json'],
      },
      alias: {
        map: [['@', './apps/*/src']],
        extensions: ['.ts', '.js', '.json'],
      },
    },
  },
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // Apply Prettier as an ESLint rule
    'no-useless-constructor': 'off', // For dependency injection
    'no-empty-function': ['error', { allow: ['constructors'] }], // Allow empty constructors; for dependency injection
    'import/extensions': 'off', // Disable the rule for file extensions
    'import/prefer-default-export': 'off', // Disable the rule for default exports
    'dot-notation': 'off', // Disable the rule for dot notation
    'class-methods-use-this': 'off', // Disable the rule for class methods
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-relative-packages': 'error',
    'no-underscore-dangle': 'off', // Allow dangling underscores in identifiers
  },
};
