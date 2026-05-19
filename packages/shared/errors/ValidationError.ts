import { PermanentError } from "./PermanentError";

export class ValidationError extends PermanentError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}