/**
 * Standard error response format according to guidelines
 */
export interface ErrorResponse {
  error: ErrorDetail;
}

export interface ErrorDetail {
  code: string;
  message: string;
  target?: string;
  details?: ErrorDetail[];
}

/**
 * Standard info/warning response format
 */
export interface InfoResponse {
  info: InfoDetail;
}

export interface InfoDetail {
  message: string;
  target?: string;
  severity?: 'INFO' | 'WARNING' | 'ERROR';
  details?: InfoDetail[];
}
