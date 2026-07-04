import { GraphQLFormattedError } from 'graphql';
import { ApplicationError } from './application-error';
import { DomainError } from './domain-error';
import { ErrorCodes } from './error-codes';
import { GraphQLErrorCodes } from './graphql-error-codes';
import { mapExceptionToGraphQLError } from './map-to-graphql-error';

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function unwrapOriginalError(error: unknown): unknown {
  if (typeof error !== 'object' || error === null) {
    return error;
  }

  if ('originalError' in error && error.originalError) {
    return error.originalError;
  }

  return error;
}

function isPrismaClientError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'clientVersion' in error &&
    'code' in error
  );
}

function normalizeGraphQLError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const originalError = unwrapOriginalError(error);

  if (
    originalError instanceof ApplicationError ||
    originalError instanceof DomainError
  ) {
    const gqlError = mapExceptionToGraphQLError(originalError);

    return {
      message: gqlError.message,
      path: formattedError.path,
      locations: formattedError.locations,
      extensions: gqlError.extensions,
    };
  }

  if (isPrismaClientError(originalError)) {
    return {
      message: 'Internal server error',
      path: formattedError.path,
      extensions: {
        appCode: ErrorCodes.INTERNAL_ERROR,
        code: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
      },
    };
  }

  if (
    originalError instanceof Error &&
    typeof formattedError.extensions?.code !== 'string'
  ) {
    return {
      message: isProduction()
        ? 'Internal server error'
        : formattedError.message,
      path: formattedError.path,
      extensions: {
        appCode: ErrorCodes.INTERNAL_ERROR,
        code: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
      },
    };
  }

  return formattedError;
}

function getSafeProductionMessage(
  formattedError: GraphQLFormattedError,
  code: string,
): string {
  if (code === GraphQLErrorCodes.INTERNAL_SERVER_ERROR) {
    return 'Internal server error';
  }

  return formattedError.message;
}

function sanitizeForProduction(
  formattedError: GraphQLFormattedError,
): GraphQLFormattedError {
  const extensions = formattedError.extensions ?? {};
  const code =
    typeof extensions.code === 'string'
      ? extensions.code
      : GraphQLErrorCodes.INTERNAL_SERVER_ERROR;

  const safeExtensions: Record<string, string> = {
    code,
  };

  if (typeof extensions.appCode === 'string') {
    safeExtensions.appCode = extensions.appCode;
  }

  return {
    message: getSafeProductionMessage(formattedError, code),
    path: formattedError.path,
    extensions: safeExtensions,
  };
}

export function formatGraphQLError(
  formattedError: GraphQLFormattedError,
  error?: unknown,
): GraphQLFormattedError {
  const normalized = normalizeGraphQLError(
    formattedError,
    error ?? formattedError,
  );

  if (!isProduction()) {
    return normalized;
  }

  return sanitizeForProduction(normalized);
}
