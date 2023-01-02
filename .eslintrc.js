module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: './',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {}
    }
  },
  rules: {
    'import/no-unresolved': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'max-len': [
      'warn',
      {
        code: 115,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true
      }
    ],
    'keyword-spacing': 'error',
    'comma-dangle': 'error',
    'arrow-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': [
      'error',
      {
        functions: 'always',
        keywords: 'always',
        classes: 'always'
      }
    ],
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['warn', 'always'],
    'no-console': 'warn',
    'no-multiple-empty-lines': 'error',
    'no-empty': 'off',
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: 'block', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' }
    ],
    semi: 'error',
    quotes: ['warn', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    'import/newline-after-import': ['error', { count: 1 }]
  }
};
