export const GraphQLErrorCodes = {
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  BAD_USER_INPUT: 'BAD_USER_INPUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export type GraphQLErrorCode =
  (typeof GraphQLErrorCodes)[keyof typeof GraphQLErrorCodes];
