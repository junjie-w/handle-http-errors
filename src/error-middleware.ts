import { ErrorRequestHandler } from 'express';
import { ErrorHandlerOptions } from './types.js';
import { errorHandler } from './error-handler.js';

export function errorMiddleware(options: ErrorHandlerOptions = {}): ErrorRequestHandler {
  return (err, _req, res, _next) => {
    errorHandler(err, res, options);
  };
}
