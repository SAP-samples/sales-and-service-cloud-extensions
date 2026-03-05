import { HttpStatus } from '@nestjs/common';
import {
  CustomException,
  BadRequestException,
  NotFoundException,
  UnprocessableContentException,
  PreconditionRequiredException,
  PreconditionFailedException,
  InternalServerErrorException,
  NotImplementedException,
  UpstreamServerErrorException,
  ForbiddenException,
  UnauthorizedException,
} from './custom.exceptions';

describe('Custom Exceptions', () => {
  describe('BadRequestException', () => {
    it('should create BadRequestException with correct code and message', () => {
      const exception = new BadRequestException('Invalid input');
      const response = exception.getResponse() as any;

      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(response.error.code).toBe('workorder.400.BadRequest');
      expect(response.error.message).toBe('Invalid input');
    });

    it('should include target when provided', () => {
      const exception = new BadRequestException('Invalid field', 'fieldName');
      const response = exception.getResponse() as any;

      expect(response.error.target).toBe('fieldName');
    });

    it('should include details when provided', () => {
      const details: any[] = [
        { code: 'validation.required', message: 'Field is required', target: 'orderName', value: null },
      ];
      const exception = new BadRequestException('Validation failed', 'body', details);
      const response = exception.getResponse() as any;

      expect(response.error.details).toEqual(details);
      expect(response.error.details).toHaveLength(1);
    });
  });

  describe('NotFoundException', () => {
    it('should create NotFoundException with correct code and message', () => {
      const exception = new NotFoundException('Resource not found');
      const response = exception.getResponse() as any;

      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
      expect(response.error.code).toBe('workorder.404.NotFound');
      expect(response.error.message).toBe('Resource not found');
    });

    it('should include target when provided', () => {
      const exception = new NotFoundException('Work Order not found', 'workOrderId=123');
      const response = exception.getResponse() as any;

      expect(response.error.target).toBe('workOrderId=123');
    });
  });

  describe('UnprocessableContentException', () => {
    it('should create UnprocessableContentException with correct code and message', () => {
      const exception = new UnprocessableContentException('Business logic validation failed');
      const response = exception.getResponse() as any;

      expect(exception.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.error.code).toBe('workorder.422.UnprocessableContent');
      expect(response.error.message).toBe('Business logic validation failed');
    });

    it('should include target and details', () => {
      const details: any[] = [
        { code: 'validation.date', message: 'Start date must be before end date', target: 'startDate', value: '2024-12-31' },
      ];
      const exception = new UnprocessableContentException('Invalid dates', 'dates', details);
      const response = exception.getResponse() as any;

      expect(response.error.details).toEqual(details);
    });
  });

  describe('PreconditionRequiredException', () => {
    it('should create PreconditionRequiredException with correct code and message', () => {
      const exception = new PreconditionRequiredException('If-Match header is required');
      const response = exception.getResponse() as any;

      expect(exception.getStatus()).toBe(HttpStatus.PRECONDITION_REQUIRED);
      expect(response.error.code).toBe('workorder.428.PreconditionRequired');
      expect(response.error.message).toBe('If-Match header is required');
    });

    it('should create with default message', () => {
      const exception = new PreconditionRequiredException();
      const response = exception.getResponse() as any;

      expect(response.error.message).toBe('Precondition (If-Match) is required');
    });
  });

  describe('PreconditionFailedException', () => {
    it('should create PreconditionFailedException with correct code and message', () => {
      const exception = new PreconditionFailedException('ETag mismatch');
      const response = exception.getResponse() as any;

      expect(exception.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
      expect(response.error.code).toBe('workorder.412.PreconditionFailed');
      expect(response.error.message).toBe('ETag mismatch');
    });

    it('should create with default message', () => {
      const exception = new PreconditionFailedException();
      const response = exception.getResponse() as any;

      expect(response.error.message).toBe('Resource has been modified by another user');
    });
  });

  describe('CustomException', () => {
    it('should create custom exception with service prefix', () => {
      const exception = new CustomException('500.InternalError', 'Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      const response = exception.getResponse() as any;

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.error.code).toBe('workorder.500.InternalError');
      expect(response.error.message).toBe('Something went wrong');
    });

    it('should handle error response with all fields', () => {
      const details: any[] = [
        { code: 'validation.error1', message: 'Error 1', target: 'field1', value: 'value1' },
        { code: 'validation.error2', message: 'Error 2', target: 'field2', value: 'value2' },
      ];
      const exception = new CustomException(
        '400.ValidationError',
        'Multiple validation errors',
        HttpStatus.BAD_REQUEST,
        'request.body',
        details
      );
      const response = exception.getResponse() as any;

      expect(response.error.code).toBe('workorder.400.ValidationError');
      expect(response.error.message).toBe('Multiple validation errors');
      expect(response.error.target).toBe('request.body');
      expect(response.error.details).toHaveLength(2);
    });
  });

  describe('Error Response Structure', () => {
    it('should follow standard error response format', () => {
      const exception = new BadRequestException('Test error', 'testTarget');
      const response = exception.getResponse() as any;

      expect(response).toHaveProperty('error');
      expect(response.error).toHaveProperty('code');
      expect(response.error).toHaveProperty('message');
      expect(response.error).toHaveProperty('target');
    });

    it('should not include undefined fields in response', () => {
      const exception = new NotFoundException('Simple error');
      const response = exception.getResponse() as any;

      expect(response.error.target).toBeUndefined();
      expect(response.error.details).toBeUndefined();
    });

    it('should include target when provided without details', () => {
      const exception = new BadRequestException('Error with target', 'field.name');
      const response = exception.getResponse() as any;

      expect(response.error.target).toBe('field.name');
      expect(response.error.details).toBeUndefined();
    });

    it('should include details when provided', () => {
      const details = [{ code: 'error1', message: 'Detail 1' }];
      const exception = new UnprocessableContentException('Error with details', 'field.name', details);
      const response = exception.getResponse() as any;

      expect(response.error.details).toEqual(details);
    });
  });

  describe('Additional Exception Classes', () => {
    it('should create InternalServerErrorException with default message', () => {
      const exception = new InternalServerErrorException();

      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('Internal server error');
    });

    it('should create InternalServerErrorException with custom message and details', () => {
      const details = [{ code: 'E1', message: 'Error detail' }];
      const exception = new InternalServerErrorException('Custom error', details);

      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('Custom error');
      expect(response.error.details).toEqual(details);
    });

    it('should create NotImplementedException', () => {
      const exception = new NotImplementedException('Feature not implemented');

      expect(exception.getStatus()).toBe(HttpStatus.NOT_IMPLEMENTED);
      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('Feature not implemented');
    });

    it('should create NotImplementedException with details', () => {
      const details = [{ code: 'F1', message: 'Feature 1' }];
      const exception = new NotImplementedException('Not implemented', details);

      const response = exception.getResponse() as any;
      expect(response.error.details).toEqual(details);
    });

    it('should create UpstreamServerErrorException', () => {
      const exception = new UpstreamServerErrorException('External service failed');

      expect(exception.getStatus()).toBe(523);
      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('External service failed');
    });

    it('should create UpstreamServerErrorException with target', () => {
      const exception = new UpstreamServerErrorException('API failed', 'external.api');

      const response = exception.getResponse() as any;
      expect(response.error.target).toBe('external.api');
    });

    it('should create ForbiddenException with default message', () => {
      const exception = new ForbiddenException();

      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('Insufficient authorizations to access this resource');
    });

    it('should create ForbiddenException with custom message', () => {
      const exception = new ForbiddenException('Access denied');

      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('Access denied');
    });

    it('should create UnauthorizedException with default message', () => {
      const exception = new UnauthorizedException();

      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('User is not authenticated');
    });

    it('should create UnauthorizedException with custom message', () => {
      const exception = new UnauthorizedException('Invalid credentials');

      const response = exception.getResponse() as any;
      expect(response.error.message).toBe('Invalid credentials');
    });
  });
});
