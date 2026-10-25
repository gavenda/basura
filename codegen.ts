import type { CodegenConfig } from '@graphql-codegen/cli';

// Generates AniList types from the live schema (https://docs.anilist.co) and the queries in src/anilist/queries.ts.
const config: CodegenConfig = {
  schema: 'https://graphql.anilist.co',
  documents: 'src/anilist/queries.ts',
  generates: {
    'src/anilist/types.ts': {
      plugins: ['typescript-operations'],
      config: {
        enumType: 'native',
        namingConvention: { enumValues: 'keep' },
        skipTypename: true
      }
    }
  },
  hooks: { afterAllFileWrite: ['prettier --write'] }
};

export default config;
