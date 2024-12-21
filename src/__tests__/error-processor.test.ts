import { errorProcessor } from '../error-processor';
import { ValidationError, NotFoundError, HttpError, UnauthorizedError, ForbiddenError, BadRequestError, InternalServerError } from '../errors';
import { isDevelopment } from '../config';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

jest.mock('../config', () => ({
  isDevelopment: true,
  isProduction: false
}));

describe('errorProcessor', () => {
  const options = { includeStack: false };
  const timestamp = expect.any(String);
  
  describe('HttpError handling', () => {
    it('should process HttpError with stack trace when includeStack is true', async () => {
      const error = new HttpError(400, 'TEST_ERROR', 'Test message');
      const result = await errorProcessor(error, { includeStack: true });
      
      expect(result).toEqual({
        status: 400,
        code: 'TEST_ERROR',
        message: 'Test message',
        timestamp,
        stack: expect.any(String)
      });
    });

    it('should process HttpError without stack trace when includeStack is false', async () => {
      const error = new HttpError(400, 'TEST_ERROR', 'Test message');
      const result = await errorProcessor(error, { includeStack: false });
      
      expect(result).toEqual({
        status: 400,
        code: 'TEST_ERROR',
        message: 'Test message',
        timestamp
      });
      expect(result.stack).toBeUndefined();
    });

    it('should process HttpError without stack when stack is not available', async () => {
      const error = new HttpError(400, 'TEST_ERROR', 'Test message');
      delete error.stack;
      const result = await errorProcessor(error, { includeStack: true });
      
      expect(result).toEqual({
        status: 400,
        code: 'TEST_ERROR',
        message: 'Test message',
        timestamp
      });
      expect(result.stack).toBeUndefined();
    });

    it('should process HttpError with details', async () => {
      const error = new HttpError(400, 'TEST_ERROR', 'Test message', { foo: 'bar' });
      const result = await errorProcessor(error, { includeStack: false });
      
      expect(result).toEqual({
        status: 400,
        code: 'TEST_ERROR',
        message: 'Test message',
        timestamp,
        details: { foo: 'bar' }
      });
    });
    
    it('should call onError if provided', async () => {
      const onError = jest.fn();
      const error = new Error('Test error');
  
      await errorProcessor(error, { onError });
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should handle error when parsing HttpError fails', async () => {
      const error = new HttpError(400, 'TEST', 'Test');
      Object.defineProperty(error, 'details', {
        get: () => { throw new Error('Parse error'); }
      });
  
      const result = await errorProcessor(error, options);
  
      expect(result).toEqual({
        status: 400,
        code: 'PARSE_ERROR',
        message: 'Could not parse request',
        timestamp,
        details: isDevelopment ? { error: 'Parse error' } : undefined
      });
    }); 

    describe('parse error handling', () => {
      it('should include parse error details in development', async () => {        
        const error = new HttpError(400, 'TEST', 'Test');
        Object.defineProperty(error, 'details', {
          get: () => { throw new Error('Custom parse error message'); }
        });
    
        const result = await errorProcessor(error, options);
    
        expect(result).toEqual({
          status: 400,
          code: 'PARSE_ERROR',
          message: 'Could not parse request',
          timestamp,
          details: {
            error: 'Custom parse error message'
          }
        });
      });
    
      it('should use default error message when parse error has no message', async () => {
        const error = new HttpError(400, 'TEST', 'Test');
        Object.defineProperty(error, 'details', {
          get: () => { throw new Error(); }
        });
    
        const result = await errorProcessor(error, options);
    
        expect(result).toEqual({
          status: 400,
          code: 'PARSE_ERROR',
          message: 'Could not parse request',
          timestamp,
          details: { error: 'Parse error' }
        });
      });

      it('should handle parse error with stack trace when error is instance of Error', async () => {
        const error = new HttpError(400, 'TEST', 'Test');
        const parseError = new Error('Parse error with stack');
        Object.defineProperty(error, 'details', {
          get: () => { throw parseError; }
        });
    
        const result = await errorProcessor(error, { includeStack: true });
    
        expect(result).toEqual({
          status: 400,
          code: 'PARSE_ERROR',
          message: 'Could not parse request',
          timestamp,
          details: isDevelopment ? { error: 'Parse error with stack' } : undefined,
          stack: expect.any(String)
        });
      });
  
      it('should handle parse error when error is not instance of Error', async () => {
        const error = new HttpError(400, 'TEST', 'Test');
        Object.defineProperty(error, 'details', {
          get: () => { throw 'Not an error instance'; }
        });
    
        const result = await errorProcessor(error, { includeStack: true });
    
        expect(result).toEqual({
          status: 400,
          code: 'PARSE_ERROR',
          message: 'Could not parse request',
          timestamp,
          details: isDevelopment ? { error: 'Parse error' } : undefined,
          stack: undefined
        });
      });
    })
  });

  describe('ValidationError handling', () => {
    it('should process ValidationError correctly', async () => {
      const error = new ValidationError('Validation failed');
      const result = await errorProcessor(error, options);
      
      expect(result).toEqual({
        status: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        timestamp
      });
    });
  
    it('should use default message when ValidationError message is undefined', async () => {
      const error = new ValidationError("");
      const result = await errorProcessor(error, options);
      
      expect(result).toEqual({
        status: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        message: ReasonPhrases.BAD_REQUEST,
        timestamp
      });
    });
  });

  describe('BadRequestError handling', () => {
    it('should process BadRequestError correctly', async () => {
      const error = new BadRequestError('Bad request');
      const result = await errorProcessor(error, options);

      expect(result).toEqual({
        status: StatusCodes.BAD_REQUEST,
        code: 'BAD_REQUEST',
        message: 'Bad request',
        timestamp,
      });
    });

    it('should use default message when BadRequestError message is undefined', async () => {
      const error = new BadRequestError("");
      const result = await errorProcessor(error, options);

      expect(result).toEqual({
        status: StatusCodes.BAD_REQUEST,
        code: 'BAD_REQUEST',
        message: ReasonPhrases.BAD_REQUEST,
        timestamp
      });
    });
  });

  describe('UnauthorizedError handling', () => {
    it('should process UnauthorizedError correctly', async () => {
      const error = new UnauthorizedError('Not logged in');
      const result = await errorProcessor(error, options);
  
      expect(result).toEqual({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Not logged in',
        timestamp
      });
    });

    it('should use default message when UnauthorizedError message is undefined', async () => {
      const error = new UnauthorizedError("");
      const result = await errorProcessor(error, options);

      expect(result).toEqual({
        status: StatusCodes.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
        message: ReasonPhrases.UNAUTHORIZED,
        timestamp
      });
    });
  });

  describe('ForbiddenError handling', () => {
    it('should process ForbiddenError correctly', async () => {
      const error = new ForbiddenError('No access');
      const result = await errorProcessor(error, options);
  
      expect(result).toEqual({
        status: 403,
        code: 'FORBIDDEN',
        message: 'No access',
        timestamp
      });
    });

    it('should use default message when ForbiddenError message is undefined', async () => {
      const error = new ForbiddenError("");
      const result = await errorProcessor(error, options);
      expect(result).toEqual({
        status: StatusCodes.FORBIDDEN,
        code: 'FORBIDDEN',
        message: ReasonPhrases.FORBIDDEN,
        timestamp
      });
    })
  })

  describe('NotFoundError handling', () => {
    it('should process NotFoundError correctly', async () => {
      const error = new NotFoundError('User not found');
      const result = await errorProcessor(error, options);
  
      expect(result).toEqual({
        status: 404,
        code: 'NOT_FOUND',
        message: 'User not found',
        timestamp
      });
    });

    it('should use default message when NotFoundError message is undefined', async () => {
      const error = new NotFoundError("");
      const result = await errorProcessor(error, options);
      expect(result).toEqual({
        status: StatusCodes.NOT_FOUND,
        code: 'NOT_FOUND',
        message: ReasonPhrases.NOT_FOUND,
        timestamp
      });
    })
  });

  describe('InternalServerError handling', () => {
    it('should process InternalServerError correctly', async () => {
      const error = new InternalServerError('Internal server error');
      const result = await errorProcessor(error, options);

      expect(result).toEqual({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        timestamp
      });
    });
  })

  describe('standard error handling', () => {
    it('should process standard Error correctly', async () => {
      const error = new Error('Standard error');
      const result = await errorProcessor(error, options);
  
      expect(result).toEqual({
        status: 500,
        code: 'INTERNAL_ERROR',
        message: isDevelopment ? 'Standard error' : 'Internal Server Error',
        timestamp,
        details: isDevelopment ? { error: 'Standard error' } : undefined,
        stack: undefined
      });
    });
  })

  describe('ServiceUnavailableError handling', () => {
    it('should process unknown errors as service unavailable', async () => {
      const result = await errorProcessor('unknown error', options);
    
      expect(result).toEqual({
        status: 503,
        code: 'SERVICE_UNAVAILABLE',
        message: isDevelopment ? 'unknown error' : 'Service Unavailable',
        timestamp,
        details: isDevelopment ? { error: 'unknown error' } : undefined
      });
    });
  })
});
