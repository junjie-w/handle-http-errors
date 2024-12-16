import { errorHandler } from '../error-handler';
import { DEFAULT_ERROR, NotFoundError, ValidationError } from '../errors';
import * as errorProcessorModule from '../error-processor';

describe('errorHandler', () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  let processorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    processorSpy = jest.spyOn(errorProcessorModule, 'errorProcessor');
  });

  afterEach(() => {
    processorSpy.mockRestore();
  });

  it('should handle ValidationError correctly', async () => {
    const error = new ValidationError('Invalid input');
    await errorHandler(error, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      code: 'VALIDATION_ERROR',
      message: 'Invalid input'
    }));
  });

  it('should handle NotFoundError correctly', async () => {
    const error = new NotFoundError('Resource not found');
    await errorHandler(error, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Resource not found'
      })
    );
  });

  it('should handle unknown errors correctly', async () => {
    const error = 'Unknown error';
    await errorHandler(error, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 503,
        code: 'SERVICE_UNAVAILABLE',
      })
    );
  });

  it('should return DEFAULT_ERROR when errorProcessor throws', async () => {
    processorSpy.mockRejectedValueOnce(new Error('Processor failed'));
    
    const error = new Error('Original error');
    await errorHandler(error, mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(DEFAULT_ERROR.status);
    expect(mockRes.json).toHaveBeenCalledWith(DEFAULT_ERROR);
  });
});
