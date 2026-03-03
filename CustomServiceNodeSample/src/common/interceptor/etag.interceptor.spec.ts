import { EtagInterceptor } from './etag.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('EtagInterceptor', () => {
  let interceptor: EtagInterceptor<any>;
  let mockContext: ExecutionContext;
  let mockHandler: CallHandler;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    interceptor = new EtagInterceptor();
    mockRequest = {
      headers: {},
      method: 'GET',
      res: {
        header: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      },
    };
    mockResponse = {
      set: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as any;
    mockHandler = {
      handle: jest.fn().mockReturnValue(of({ value: { id: '123', updatedAt: new Date() } })),
    };
  });

  describe('intercept', () => {
    it('should set ETag header for GET requests', (done) => {
      mockRequest.method = 'GET';
      const result = { value: { id: '123', updatedAt: new Date() } };
      mockHandler.handle = jest.fn().mockReturnValue(of(result));

      interceptor.intercept(mockContext, mockHandler).subscribe({
        next: (data) => {
          expect(mockRequest.res.header).toHaveBeenCalled();
          expect(data).toEqual(result);
          done();
        },
        error: (err) => done(err),
      });
    });

    it('should handle POST requests without ETag', (done) => {
      mockRequest.method = 'POST';
      const result = { value: { id: '456' } };
      mockHandler.handle = jest.fn().mockReturnValue(of(result));

      interceptor.intercept(mockContext, mockHandler).subscribe({
        next: (data) => {
          expect(mockRequest.res.header).not.toHaveBeenCalled();
          expect(data).toEqual(result);
          done();
        },
        error: (err) => done(err),
      });
    });

    it('should handle DELETE requests', (done) => {
      mockRequest.method = 'DELETE';
      const result = { value: [{ status: 'deleted' }] };
      mockHandler.handle = jest.fn().mockReturnValue(of(result));

      interceptor.intercept(mockContext, mockHandler).subscribe({
        next: (data) => {
          expect(data).toEqual(result);
          done();
        },
        error: (err) => done(err),
      });
    });
  });
});
