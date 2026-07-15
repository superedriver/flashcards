import { GraphQLError } from 'graphql';
import { ApplicationError } from './application-error';
import { DomainError } from './domain-error';
import { ErrorCode, ErrorCodes } from './error-codes';
import { GraphQLErrorCode, GraphQLErrorCodes } from './graphql-error-codes';

const ERROR_CODE_TO_GRAPHQL: Record<ErrorCode, GraphQLErrorCode> = {
  [ErrorCodes.UNAUTHORIZED]: GraphQLErrorCodes.UNAUTHENTICATED,
  [ErrorCodes.INVALID_CREDENTIALS]: GraphQLErrorCodes.UNAUTHENTICATED,

  [ErrorCodes.FORBIDDEN]: GraphQLErrorCodes.FORBIDDEN,
  [ErrorCodes.DECK_FORBIDDEN]: GraphQLErrorCodes.FORBIDDEN,
  [ErrorCodes.CARD_FORBIDDEN]: GraphQLErrorCodes.FORBIDDEN,
  [ErrorCodes.GROUP_FORBIDDEN]: GraphQLErrorCodes.FORBIDDEN,
  [ErrorCodes.ADMIN_FORBIDDEN]: GraphQLErrorCodes.FORBIDDEN,
  [ErrorCodes.USER_BLOCKED]: GraphQLErrorCodes.FORBIDDEN,

  [ErrorCodes.NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,
  [ErrorCodes.DECK_NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,
  [ErrorCodes.CARD_NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,
  [ErrorCodes.LESSON_NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,
  [ErrorCodes.GROUP_NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,
  [ErrorCodes.GROUP_INVITATION_NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,

  [ErrorCodes.VALIDATION_ERROR]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.INVALID_REVIEW_ANSWER]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.GROUP_INVITATION_INVALID]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.LANGUAGE_NOT_FOUND]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.STUDY_LANGUAGE_NOT_FOUND]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.PREVIEW_SESSION_NOT_FOUND]: GraphQLErrorCodes.NOT_FOUND,
  [ErrorCodes.PREVIEW_SESSION_ACTIVE]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.USER_ALREADY_EXISTS]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.EMAIL_NOT_VERIFIED]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.LESSON_NOT_ACTIVE]: GraphQLErrorCodes.BAD_USER_INPUT,
  [ErrorCodes.LESSON_CARD_ALREADY_REVIEWED]: GraphQLErrorCodes.BAD_USER_INPUT,

  [ErrorCodes.INTERNAL_ERROR]: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
};

function mapErrorCodeToGraphQLCode(code: ErrorCode): GraphQLErrorCode {
  return ERROR_CODE_TO_GRAPHQL[code] ?? GraphQLErrorCodes.BAD_USER_INPUT;
}

function isPrismaClientError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'clientVersion' in error &&
    'code' in error
  );
}

export function mapExceptionToGraphQLError(exception: unknown): GraphQLError {
  if (exception instanceof ApplicationError) {
    return new GraphQLError(exception.message, {
      extensions: {
        appCode: exception.code,
        code: mapErrorCodeToGraphQLCode(exception.code),
      },
    });
  }

  if (exception instanceof DomainError) {
    return new GraphQLError(exception.message, {
      extensions: {
        appCode: exception.code,
        code: GraphQLErrorCodes.BAD_USER_INPUT,
      },
    });
  }

  if (isPrismaClientError(exception)) {
    return new GraphQLError('Internal server error', {
      extensions: {
        appCode: ErrorCodes.INTERNAL_ERROR,
        code: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
      },
    });
  }

  return new GraphQLError('Internal server error', {
    extensions: {
      appCode: ErrorCodes.INTERNAL_ERROR,
      code: GraphQLErrorCodes.INTERNAL_SERVER_ERROR,
    },
  });
}
