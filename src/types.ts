export interface ErrorDetails {
  [key: string]: string | number | boolean | undefined | ErrorDetails;
}

export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  details?: ErrorDetails;
  stack?: string;
}

export interface HttpResponse {
  status(code: number): {
    json(data: unknown): unknown
  };
}

export interface ErrorHandlerOptions {
  includeStack?: boolean;
  onError?: (error: unknown) => void | Promise<void>;
}
