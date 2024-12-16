import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { BadRequestError, ForbiddenError, HttpError, InternalServerError, NotFoundError, UnauthorizedError, ValidationError } from '../errors';

describe('Error Classes', () => {
  describe('HttpError', () => {
    it('should create HttpError with correct properties', () => {
      const error = new HttpError(400, 'TEST_ERROR', 'Test message', { test: true });

      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test message');
      expect(error.details).toEqual({ test: true });
      expect(error.stack).toBeDefined();
    });

    it('should correctly identify HttpError instances', () => {
      const error = new HttpError(400, 'TEST_ERROR', 'Test message');
      const regularError = new Error('Regular error');

      expect(HttpError.isHttpError(error)).toBe(true);
      expect(HttpError.isHttpError(regularError)).toBe(false);
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with correct defaults', () => {
      const error = new ValidationError();

      expect(error.status).toBe(StatusCodes.BAD_REQUEST);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.message).toBe(ReasonPhrases.BAD_REQUEST);
    });

    it('should create with custom message and details', () => {
      const details = { field: 'email' };
      const error = new ValidationError('Invalid email', details);
      
      expect(error.message).toBe('Invalid email');
      expect(error.details).toEqual(details);
    });
  });

  describe('BadRequestError', () => {
    it('should create BadRequestError with correct defaults', () => {
      const error = new BadRequestError();

      expect(error.status).toBe(StatusCodes.BAD_REQUEST);
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toBe(ReasonPhrases.BAD_REQUEST);
    });

    it('should create with custom message and details', () => {
      const details = { param: 'userId' };
      const error = new BadRequestError('Invalid request parameters', details);
      
      expect(error.message).toBe('Invalid request parameters');
      expect(error.details).toEqual(details);
    });

    it('should correctly identify BadRequestError instances', () => {
      const error = new BadRequestError();
      const otherError = new Error('Other error');
      
      expect(BadRequestError.isBadRequestError(error)).toBe(true);
      expect(BadRequestError.isBadRequestError(otherError)).toBe(false);
    });
  });

  describe("UnauthorizedError", () => {
    it('should create UnauthorizedError with correct defaults', () => {
      const error = new UnauthorizedError(); 
      
      expect(error.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.message).toBe(ReasonPhrases.UNAUTHORIZED);
    })

    it('should create with custom message and details', () => {
      const details = { reason: 'Invalid credentials' };
      const error = new UnauthorizedError('Authentication failed', details);

      expect(error.message).toBe('Authentication failed');
      expect(error.details).toEqual(details);
    });
  });

  describe('ForbiddenError', () => {
    it('should create ForbiddenError with correct defaults', () => {
      const error = new ForbiddenError();

      expect(error.status).toBe(StatusCodes.FORBIDDEN);
      expect(error.code).toBe('FORBIDDEN');
      expect(error.message).toBe(ReasonPhrases.FORBIDDEN);
    })

    it('should create with custom message and details', () => {
      const details = { reason: 'Insufficient permissions' };
      const error = new ForbiddenError('Access denied', details);

      expect(error.message).toBe('Access denied');
      expect(error.details).toEqual(details);
    });
  })

  describe('NotFoundError', () => {
    it('should create NotFoundError with correct defaults', () => {
      const error = new NotFoundError();
      
      expect(error.status).toBe(StatusCodes.NOT_FOUND);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe(ReasonPhrases.NOT_FOUND);
    })

    it('should create with custom message and details', () => {
      const details = { entity: 'User', id: 123 };
      const error = new NotFoundError('User not found', details);

      expect(error.message).toBe('User not found');
      expect(error.details).toEqual(details);
    });
  })

  describe('InternalServerError', () => {
    it('should create InternalServerError with correct defaults', () => {
      const error = new InternalServerError();

      expect(error.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.message).toBe(ReasonPhrases.INTERNAL_SERVER_ERROR);
    });

    it('should create with custom message and details', () => {
      const details = { reason: 'Database connection failed' };
      const error = new InternalServerError('Database error occurred', details);
      
      expect(error.message).toBe('Database error occurred');
      expect(error.details).toEqual(details);
    });

    it('should correctly identify InternalServerError instances', () => {
      const error = new InternalServerError();
      const otherError = new Error('Other error');
      
      expect(InternalServerError.isInternalServerError(error)).toBe(true);
      expect(InternalServerError.isInternalServerError(otherError)).toBe(false);
    });

    it('should extend HttpError', () => {
      const error = new InternalServerError();
      
      expect(error).toBeInstanceOf(HttpError);
      expect(HttpError.isHttpError(error)).toBe(true);
    });
  });
});
