import { BaseError } from "./BaseError";

export class PermanentError extends BaseError {
  constructor(message: string, code?: string) {
    super(message, false, code);
  }
}