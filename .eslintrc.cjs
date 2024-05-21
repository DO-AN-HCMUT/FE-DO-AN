const { group } = require('console');

const ecmaVersion = 2018;
const tsParserOptions = {
  ecmaFeatures: {
    jsx: true,
  },
  ecmaVersion,
  project: './tsconfig.json',
  tsconfigRootDir: __dirname,
  sourceType: 'module',
};
const tsParser = '@typescript-eslint/parser';

const banTypes = {
  String: {
    message: 'Use string instead',
    fixWith: 'string',
  },
  Boolean: {
    message: 'Use boolean instead',
    fixWith: 'boolean',
  },
  Number: {
    message: 'Use number instead',
    fixWith: 'number',
  },
  Symbol: {
    message: 'Use symbol instead',
    fixWith: 'symbol',
  },
  BigInt: {
    message: 'Use bigint instead',
    fixWith: 'bigint',
  },

  Function: {
    message: [
      'The `Function` type accepts any function-like value.',
      'It provides no type safety when calling the function, which can be a common source of bugs.',
      'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
      'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
    ].join('\n'),
  },

  // object typing
  Object: {
    message: [
      'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
      '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
      '- If you want a type meaning "any value", you probably want `unknown` instead.',
      '- If you really want a type meaning "any non-nullish value", you probably want `NonNullable<unknown>` instead.',
    ].join('\n'),
    suggest: ['Record<string, unknown>', 'unknown', 'NonNullable<unknown>'],
  },
  '{}': {
    message: [
      '`{}` actually means "any non-nullish value".',
      '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
      '- If you want a type meaning "any value", you probably want `unknown` instead.',
      '- If you want a type meaning "empty object", you probably want `Record<string, never>` instead.',
      '- If you really want a type meaning "any non-nullish value", you probably want `NonNullable<unknown>` instead.',
    ].join('\n'),
    suggest: ['Record<string, unknown>', 'unknown', 'Record<string, never>', 'NonNullable<unknown>'],
  },
};

const namingConvention = [
  {
    selector: 'variable',
    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
  },
  {
    selector: 'function',
    format: ['camelCase', 'PascalCase'],
  },
  {
    selector: 'variableLike',
    format: ['camelCase', 'UPPER_CASE'],
  },
  {
    selector: 'parameter',
    format: ['camelCase'],
    leadingUnderscore: 'allow',
  },
  // Enforce that all classes, enums, interfaces, type aliases and type parameters are PascalCase
  {
    selector: 'typeLike',
    format: ['PascalCase'],
  },
  // Enforce that enum members are UPPER_CASE
  {
    selector: 'enumMember',
    format: ['UPPER_CASE'],
  },
  // Enforce that private members of classes are camelCase with a leading underscore
  {
    selector: 'memberLike',
    modifiers: ['private'],
    format: ['camelCase'],
    leadingUnderscore: 'require',
  },
  // Enforce that boolean variables are prefixed with an allowed verb
  {
    selector: 'variable',
    types: ['boolean'],
    format: ['PascalCase'],
    prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
  },
  // Enforce that interface names begin with an I
  {
    selector: 'interface',
    format: ['PascalCase'],
    custom: {
      regex: '^I[A-Z]',
      match: true,
    },
  },
];

module.exports = {
  env: {
    browser: true,
    es2024: true,
    jest: true,
  },
  extends: [
    'next',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion,
    sourceType: 'module',
  },
  plugins: [],
  root: true,
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'arrow-parens': ['error', 'always'],
    'arrow-spacing': [
      'error',
      {
        after: true,
        before: true,
      },
    ],
    'brace-style': ['error', '1tbs'],
    camelcase: ['off'],
    'comma-dangle': ['error', 'always-multiline'],
    complexity: [
      'error',
      {
        max: 10,
      },
    ],
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'off',

    'import/first': 'error',
    'import/newline-after-import': [
      'error',
      {
        count: 1,
      },
    ],
    'import/no-cycle': [
      'error',
      {
        maxDepth: 5,
      },
    ],
    'import/no-self-import': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@/types/**',
            group: 'type',
          },
        ],
      },
    ],

    'max-depth': ['error', 3],
    'max-len': [
      'error',
      {
        code: 150,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'max-lines': ['error', 200],
    'max-lines-per-function': [
      'error',
      {
        max: 60,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['error', 4],
    'max-statements': ['warn', 15],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions'],
      },
    ],
    'no-shadow': 'error',
    'no-tabs': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'quote-props': ['off'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    semi: ['error', 'always'],
    'space-infix-ops': ['error'],
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: tsParser,
      parserOptions: tsParserOptions,
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/ban-types': ['error', { types: banTypes, extendDefaults: false }],
        '@typescript-eslint/type-annotation-spacing': [
          'error',
          {
            before: false,
            after: true,
            overrides: {
              arrow: { before: true, after: true },
            },
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
          },
        ],
        'no-invalid-this': 'off',
        '@typescript-eslint/no-invalid-this': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/naming-convention': ['error', ...namingConvention],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              constructors: 'no-public',
            },
          },
        ],
      },
    },
    {
      files: ['**/*.tsx'],
      plugins: ['react'],
      rules: {
        'react/prop-types': 'off',
        'max-lines': ['error', 300],
        'max-lines-per-function': [
          'error',
          {
            max: 150,
            skipBlankLines: true,
            skipComments: true,
          },
        ],
      },
    },
    {
      files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'max-lines-per-function': 'off',
        'max-lines': 'off',
        'max-depth': 'off',
        'max-nested-callbacks': 'off',
        'no-console': 'off',
        'no-use-before-define': 'off',
      },
    },
  ],
};
