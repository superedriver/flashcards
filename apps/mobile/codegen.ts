import type { CodegenConfig } from '@graphql-codegen/cli'

const schemaUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql'

const config: CodegenConfig = {
  documents: ['src/**/*.{graphql,ts,tsx}'],
  generates: {
    'src/graphql/generated/index.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
      },
    },
  },
  ignoreNoDocuments: true,
  schema: schemaUrl,
}

export default config
