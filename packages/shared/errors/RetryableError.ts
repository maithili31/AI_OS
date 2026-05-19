import { BaseError } from "./BaseError";

export class RetryableError extends BaseError {
  constructor(message: string, code?: string) {
    super(message, true, code);
  }
}