import { RetryableError } from "./RetryableError";

export class RateLimitError extends RetryableError {
  constructor(message = "Rate limit exceeded") {
    super(message, "RATE_LIMIT");
  }
}