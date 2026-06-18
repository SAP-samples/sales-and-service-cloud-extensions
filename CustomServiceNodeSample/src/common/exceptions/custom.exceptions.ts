import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse, ErrorDetail } from '../interfaces/error-response.interface';

/**
 * Base custom exception that formats error response according to guidelines
 * Error code format: service.code.category
 */
export class CustomException extends HttpException {
  constructor(
    code: string,
    message: string,
    status: HttpStatus,
    target?: string,
    details?: ErrorDetail[],
  ) {
    const errorResponse: ErrorResponse = {
      error: {
        code: `workorder.${code}`,
        message,
        target,
        details,
      },
    };
    super(errorResponse, status);
  }
}

/**
 * 400 Bad Request
 * Request cannot be processed as it does not match what was defined for the API
 */
export class BadRequestException extends CustomException {
  constructor(message: string, target?: string, details?: ErrorDetail[]) {
    super('400.BadRequest', message, HttpStatus.BAD_REQUEST, target, details);
  }
}

/**
 * 404 Not Found
 * Resource does not exist in the system
 */
export class NotFoundException extends CustomException {
  constructor(message: string, target?: string) {
    super('404.NotFound', message, HttpStatus.NOT_FOUND, target);
  }
}

/**
 * 422 Unprocessable Content
 * Request body is syntactically correct but failed business logic validation
 */
export class UnprocessableContentException extends CustomException {
  constructor(message: string, target?: string, details?: ErrorDetail[]) {
    super(
      '422.UnprocessableContent',
      message,
      HttpStatus.UNPROCESSABLE_ENTITY,
      target,
      details,
    );
  }
}

/**
 * 428 Precondition Required
 * If the precondition (If-Match) is missing in the header
 */
export class PreconditionRequiredException extends CustomException {
  constructor(message: string = 'Precondition (If-Match) is required') {
    super(
      '428.PreconditionRequired',
      message,
      HttpStatus.PRECONDITION_REQUIRED,
    );
  }
}

/**
 * 412 Precondition Failed
 * State conflict when client requests update based on known state of object (ETag / If-Match)
 */
export class PreconditionFailedException extends CustomException {
  constructor(message: string = 'Resource has been modified by another user') {
    super(
      '412.PreconditionFailed',
      message,
      HttpStatus.PRECONDITION_FAILED,
    );
  }
}

/**
 * 500 Internal Server Error
 * General exception or error raised by the server
 */
export class InternalServerErrorException extends CustomException {
  constructor(message: string = 'Internal server error', details?: ErrorDetail[]) {
    super(
      '500.InternalServerError',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      undefined,
      details,
    );
  }
}

/**
 * 501 Not Implemented
 * System query option is planned but not yet implemented
 */
export class NotImplementedException extends CustomException {
  constructor(message: string, details?: ErrorDetail[]) {
    super(
      '501.NotImplemented',
      message,
      HttpStatus.NOT_IMPLEMENTED,
      undefined,
      details,
    );
  }
}

/**
 * 523 Upstream Server Error
 * Failed calls made to an external service
 */
export class UpstreamServerErrorException extends CustomException {
  constructor(message: string, target?: string) {
    super(
      '523.UpstreamServerError',
      message,
      523 as HttpStatus, // Custom status code
      target,
    );
  }
}

/**
 * 403 Forbidden
 * User is authenticated but does not have authorizations to access the resource
 */
export class ForbiddenException extends CustomException {
  constructor(message: string = 'Insufficient authorizations to access this resource') {
    super('403.Forbidden', message, HttpStatus.FORBIDDEN);
  }
}

/**
 * 401 Unauthorized
 * User is not authenticated
 */
export class UnauthorizedException extends CustomException {
  constructor(message: string = 'User is not authenticated') {
    super('401.Unauthorized', message, HttpStatus.UNAUTHORIZED);
  }
}
