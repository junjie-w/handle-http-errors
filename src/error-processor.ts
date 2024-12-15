import { isDevelopment } from "./config";
import { BadRequestError, ForbiddenError, HttpError, NotFoundError, UnauthorizedError, ValidationError } from "./errors";
import { ErrorHandlerOptions, ErrorResponse } from "./types";
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export async function errorProcessor(
  error: unknown,
  options: ErrorHandlerOptions
): Promise<ErrorResponse> {
  const { includeStack, onError } = options;

  if (onError) {
    await onError(error);
  }

  if (ValidationError.isValidationError(error)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
      message: error.message || ReasonPhrases.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      details: error.details
    };
  }

  if (BadRequestError.isBadRequestError(error)) {
    return {
      status: StatusCodes.BAD_REQUEST,
      code: 'BAD_REQUEST',
      message: error.message || ReasonPhrases.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      details: error.details
    };
  }

  if (UnauthorizedError.isUnauthorizedError(error)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
      message: error.message || ReasonPhrases.UNAUTHORIZED,
      timestamp: new Date().toISOString(),
      details: error.details
    };
  }

  if (ForbiddenError.isForbiddenError(error)) {
    return {
      status: StatusCodes.FORBIDDEN,
      code: 'FORBIDDEN',
      message: error.message || ReasonPhrases.FORBIDDEN,
      timestamp: new Date().toISOString(),
      details: error.details
    };
  }

  if (NotFoundError.isNotFoundError(error)) {
    return {
      status: StatusCodes.NOT_FOUND,
      code: 'NOT_FOUND',
      message: error.message || ReasonPhrases.NOT_FOUND,
      timestamp: new Date().toISOString(),
      details: error.details
    };
  }
  
  if (HttpError.isHttpError(error)) {
    try {
      const response: ErrorResponse = {
        status: error.status,
        code: error.code,
        message: error.message,
        timestamp: new Date().toISOString(),
        details: error.details
      };

      if (includeStack && isDevelopment) {
        response.stack = error.stack;
      }

      return response;
    } catch (parseError) {
      return {
        status: StatusCodes.BAD_REQUEST,
        code: 'PARSE_ERROR',
        message: 'Could not parse request',
        timestamp: new Date().toISOString(),
        details: isDevelopment ? {
          error: (parseError as Error)?.message || 'Parse error'
        } : undefined
      };
    }
  }

  if (error instanceof Error) {
    return {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: isDevelopment ? error.message : ReasonPhrases.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      stack: includeStack ? error.stack : undefined
    };
  }

  return {
    status: StatusCodes.SERVICE_UNAVAILABLE,
    code: 'SERVICE_UNAVAILABLE',
    message: isDevelopment ? String(error) : ReasonPhrases.SERVICE_UNAVAILABLE,
    timestamp: new Date().toISOString(),
    details: isDevelopment ? {
      error: String(error)
    } : undefined
  };
}
