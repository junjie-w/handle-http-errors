import { ErrorRequestHandler } from 'express';
import { ErrorHandlerOptions } from './types';
import { errorHandler } from './error-handler';

export function errorMiddleware(options: ErrorHandlerOptions = {}): ErrorRequestHandler {
  return (err, _req, res, _next) => {
    errorHandler(err, res, options);
  };
}
