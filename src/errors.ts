import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorDetails } from "./types";

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = ReasonPhrases.BAD_REQUEST, details?: ErrorDetails) {
    super(StatusCodes.BAD_REQUEST, 'VALIDATION_ERROR', message, details);
  }

  static isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = ReasonPhrases.BAD_REQUEST, details?: ErrorDetails) {
    super(StatusCodes.BAD_REQUEST, 'BAD_REQUEST', message, details);
  }

  static isBadRequestError(error: unknown): error is BadRequestError {
    return error instanceof BadRequestError;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED, details?: ErrorDetails) {
    super(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED', message, details);
  }

  static isUnauthorizedError(error: unknown): error is UnauthorizedError {
    return error instanceof UnauthorizedError;
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = ReasonPhrases.FORBIDDEN, details?: ErrorDetails) {
    super(StatusCodes.FORBIDDEN, 'FORBIDDEN', message, details);
  }

  static isForbiddenError(error: unknown): error is ForbiddenError {
    return error instanceof ForbiddenError;
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = ReasonPhrases.NOT_FOUND, details?: ErrorDetails) {
    super(StatusCodes.NOT_FOUND, 'NOT_FOUND', message, details);
  }

  static isNotFoundError(error: unknown): error is NotFoundError {
    return error instanceof NotFoundError;
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR, details?: ErrorDetails) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR', message, details);
  }

  static isInternalServerError(error: unknown): error is InternalServerError {
    return error instanceof InternalServerError;
  }
}

export const DEFAULT_ERROR = {
  status: StatusCodes.INTERNAL_SERVER_ERROR,
  code: 'INTERNAL_ERROR',
  message: ReasonPhrases.INTERNAL_SERVER_ERROR
} as const;
