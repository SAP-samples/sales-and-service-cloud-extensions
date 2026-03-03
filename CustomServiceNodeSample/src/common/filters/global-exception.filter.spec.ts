import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
  PreconditionFailedException,
} from '../exceptions/custom.exceptions';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockRequest = {
      url: '/test',
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as any;
  });

  describe('catch', () => {
    it('should handle custom BadRequestException', () => {
      const exception = new BadRequestException('Invalid input');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle custom NotFoundException', () => {
      const exception = new NotFoundException('Resource not found');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle custom PreconditionFailedException', () => {
      const exception = new PreconditionFailedException();

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.PRECONDITION_FAILED);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle standard HttpException', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle generic Error as internal server error', () => {
      const exception = new Error('Internal error occurred');

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should include error details in response', () => {
      const exception = new BadRequestException('Test error', 'ERR_TEST');

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error).toBeDefined();
      expect(jsonCall.error.message).toBe('Test error');
    });

    it('should handle exceptions with details array', () => {
      const exception = new BadRequestException('Validation failed', 'VALIDATION_ERROR', [
        { code: 'INVALID_EMAIL', message: 'Invalid format', target: 'email' },
      ]);

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.details).toBeDefined();
      expect(jsonCall.error.details).toHaveLength(1);
    });

    it('should pass through error code from exception', () => {
      const exception = new NotFoundException('Not found');

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.code).toBeDefined();
      expect(jsonCall.error.code).toContain('workorder.');
    });

    it('should handle target field in exceptions', () => {
      const exception = new BadRequestException('Error', 'fieldName');

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.target).toBe('fieldName');
    });

    it('should handle exceptions without custom properties', () => {
      const exception = new HttpException('Simple error', HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should handle Error objects with stack traces', () => {
      const exception = new Error('Critical failure');
      exception.stack = 'Error: Critical failure\n    at someFunction...';

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should handle HttpException with array message', () => {
      const exception = new HttpException({ message: ['error1', 'error2'] }, HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.message).toBe('error1, error2');
    });

    it('should handle HttpException with object response containing target', () => {
      const exception = new HttpException({ message: 'Error', target: 'field.name' }, HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.target).toBe('field.name');
    });

    it('should handle HttpException with object response containing details', () => {
      const exception = new HttpException({
        message: 'Validation error',
        details: [{ code: 'E1', message: 'Error 1' }]
      }, HttpStatus.BAD_REQUEST);

      filter.catch(exception, mockHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.details).toHaveLength(1);
    });

    it('should handle HttpException with string response', () => {
      const exception = new HttpException('String error', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.error.message).toBeDefined();
    });
  });
});
