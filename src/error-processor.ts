import { isDevelopment } from "./config.js";
import { BadRequestError, ForbiddenError, HttpError, NotFoundError, UnauthorizedError, ValidationError } from "./errors.js";
import { ErrorHandlerOptions, ErrorResponse } from "./types.js";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export async function errorProcessor(
  error: unknown,
  options: ErrorHandlerOptions
): Promise<ErrorResponse> {
  const { includeStack, onError } = options;
  const timestamp = new Date().toISOString();
  const getStack = (err: unknown) => 
    err instanceof Error && includeStack && err.stack ? err.stack : undefined;

  if (onError) {
    await onError(error);
  }

  if (ValidationError.isValidationError(error)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
      message: error.message || ReasonPhrases.BAD_REQUEST,
      timestamp,
      details: error.details,
      stack: getStack(error)
    };
  }

  if (BadRequestError.isBadRequestError(error)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      code: 'BAD_REQUEST',
      message: error.message || ReasonPhrases.BAD_REQUEST,
      timestamp,
      details: error.details,
      stack: getStack(error)
    };
  }

  if (UnauthorizedError.isUnauthorizedError(error)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
      message: error.message || ReasonPhrases.UNAUTHORIZED,
      timestamp,
      details: error.details,
      stack: getStack(error)
    };
  }

  if (ForbiddenError.isForbiddenError(error)) {
    return {
      status: StatusCodes.FORBIDDEN,
      code: 'FORBIDDEN',
      message: error.message || ReasonPhrases.FORBIDDEN,
      timestamp,
      details: error.details,
      stack: getStack(error)
    };
  }

  if (NotFoundError.isNotFoundError(error)) {
    return {
      status: StatusCodes.NOT_FOUND,
      code: 'NOT_FOUND',
      message: error.message || ReasonPhrases.NOT_FOUND,
      timestamp,
      details: error.details,
      stack: getStack(error)
    };
  }
  
  if (HttpError.isHttpError(error)) {
    try {
      const response: ErrorResponse = {
        status: error.status,
        code: error.code,
        message: error.message,
        timestamp,
        details: error.details,
        stack: getStack(error)
      };

      return response;
    } catch (parseError) {
      return {
        status: StatusCodes.BAD_REQUEST,
        code: 'PARSE_ERROR',
        message: 'Could not parse request',
        timestamp,
        details: isDevelopment ? {
          error: (parseError as Error)?.message || 'Parse error'
        } : undefined,
        stack: getStack(parseError)
      };
    }
  }

  if (error instanceof Error) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: isDevelopment ? error.message : ReasonPhrases.INTERNAL_SERVER_ERROR,
      timestamp,
      details: isDevelopment ? {
        error: error.message
      } : undefined,
      stack: getStack(error)
    };
  }

  return {
    status: StatusCodes.SERVICE_UNAVAILABLE,
    code: 'SERVICE_UNAVAILABLE',
    message: isDevelopment ? String(error) : ReasonPhrases.SERVICE_UNAVAILABLE,
    timestamp,
    details: isDevelopment ? {
      error: String(error)
    } : undefined,
    stack: getStack(error)
  };
}
