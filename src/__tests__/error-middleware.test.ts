import { errorMiddleware } from '../error-middleware';
import { NotFoundError, ValidationError } from '../errors';
import { Request, Response, NextFunction } from 'express';

describe('errorMiddleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle NotFoundError in express middleware', async () => {
    const error = new NotFoundError('Resource not found');
    const middleware = errorMiddleware();
    await middleware(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Resource not found'
      })
    );
  });

  it('should handle ValidationError in express middleware', async () => {
    const error = new ValidationError('Invalid input');
    const middleware = errorMiddleware();
    await middleware(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Invalid input'
      })
    );
  });
});
