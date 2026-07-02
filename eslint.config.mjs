import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '**/coverage/**',
      '.expo/**',
      '.next/**',
      '.vercel/**',
      '.tamagui/**',
      'apps/mobile/web-build/**',
      'apps/mobile/dist/**',
      'apps/api/src/generated/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/babel.config.js', '**/metro.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        exports: 'writable',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
