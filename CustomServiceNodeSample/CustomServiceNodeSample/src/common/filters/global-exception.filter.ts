import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse, ErrorDetail } from '../interfaces/error-response.interface';

/**
 * Global exception filter to format all errors according to the standard error response format
 * Following HTTP Response code and Message handling guidelines
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let errorResponse: ErrorResponse;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle custom error format
      if (typeof exceptionResponse === 'object' && 'error' in exceptionResponse) {
        errorResponse = exceptionResponse as ErrorResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const response = exceptionResponse as any;
        errorResponse = {
          error: {
            code: this.getErrorCode(status, exception.name),
            message: Array.isArray(response.message)
              ? response.message.join(', ')
              : response.message || exception.message,
            target: response.target,
            details: response.details,
          },
        };
      } else {
        errorResponse = {
          error: {
            code: this.getErrorCode(status, exception.name),
            message: exception.message,
          },
        };
      }
    } else if (exception instanceof Error) {
      // Handle generic errors as 500
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        error: {
          code: 'workorder.500.InternalServerError',
          message: exception.message || 'Internal server error',
        },
      };
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    } else {
      // Handle unknown exceptions
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        error: {
          code: 'workorder.500.InternalServerError',
          message: 'An unexpected error occurred',
        },
      };
      this.logger.error(`Unknown exception: ${JSON.stringify(exception)}`);
    }

    response.status(status).json(errorResponse);
  }

  /**
   * Generate error code based on HTTP status and exception name
   * Format: service.code.category
   */
  private getErrorCode(status: number, exceptionName: string): string {
    const codeMap: Record<number, string> = {
      400: '400.BadRequest',
      401: '401.Unauthorized',
      403: '403.Forbidden',
      404: '404.NotFound',
      405: '405.MethodNotAllowed',
      412: '412.PreconditionFailed',
      415: '415.UnsupportedMediaType',
      422: '422.UnprocessableContent',
      428: '428.PreconditionRequired',
      500: '500.InternalServerError',
      501: '501.NotImplemented',
      523: '523.UpstreamServerError',
    };

    const code = codeMap[status] || `${status}.${exceptionName}`;
    return `workorder.${code}`;
  }
}
