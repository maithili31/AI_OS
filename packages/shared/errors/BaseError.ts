export class BaseError extends Error {
    public readonly retryable: boolean;
    public readonly code?: string;
  
    constructor(
      message: string,
      retryable = false,
      code?: string
    ) {
      super(message);
  
      this.name = this.constructor.name;
      this.retryable = retryable;
      this.code = code;
  
      Error.captureStackTrace(this, this.constructor);
    }
}