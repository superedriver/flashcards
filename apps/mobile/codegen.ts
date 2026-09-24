import type { CodegenConfig } from '@graphql-codegen/cli'

const schemaUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql'

const config: CodegenConfig = {
  documents: ['src/**/*.{graphql,ts,tsx}', '!src/graphql/generated/**'],
  generates: {
    'src/graphql/generated/index.ts': {
      plugins: [
        { add: { content: '/* eslint-disable */\n// @ts-nocheck' } },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        dedupeOperationSuffix: true,
        dedupeFragments: true,
        scalars: {
          DateTime: 'string',
        },
      },
    },
  },
  ignoreNoDocuments: true,
  schema: schemaUrl,
}

export default config
