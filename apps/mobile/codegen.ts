import type { CodegenConfig } from '@graphql-codegen/cli'

const schemaUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql'

const sharedConfig = {
  scalars: {
    DateTime: 'string',
  },
}

const config: CodegenConfig = {
  documents: ['src/**/*.{graphql,ts,tsx}', '!src/graphql/generated/**'],
  generates: {
    'src/graphql/generated/schema.ts': {
      plugins: ['typescript'],
      config: sharedConfig,
    },
    'src/graphql/generated/operations.ts': {
      plugins: [
        { add: { content: '/* eslint-disable */\n// @ts-nocheck' } },
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        ...sharedConfig,
        withHooks: true,
        dedupeOperationSuffix: true,
        dedupeFragments: true,
        namespacedImportName: 'SchemaTypes',
        importSchemaTypesFrom: 'src/graphql/generated/schema',
        apolloReactHooksImportFrom: '@apollo/client/react',
      },
    },
  },
  ignoreNoDocuments: true,
  schema: schemaUrl,
}

export default config
