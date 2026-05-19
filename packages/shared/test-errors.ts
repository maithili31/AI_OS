import {
    RetryableError,
    PermanentError,
    ValidationError,
    RateLimitError
  } from "./index";
  
  const retryErr = new RetryableError(
    "Temporary Gmail failure"
  );
  
  console.log("Retryable Error:");
  console.log(retryErr.name);
  console.log(retryErr.message);
  console.log(retryErr.retryable);
  console.log(retryErr.code);
  
  console.log("----------------");
  
  const permanentErr = new PermanentError(
    "Invalid workflow"
  );
  
  console.log("Permanent Error:");
  console.log(permanentErr.name);
  console.log(permanentErr.message);
  console.log(permanentErr.retryable);
  console.log(permanentErr.code);
  
  console.log("----------------");
  
  const validationErr = new ValidationError(
    "Workflow missing trigger"
  );
  
  console.log("Validation Error:");
  console.log(validationErr.name);
  console.log(validationErr.message);
  console.log(validationErr.retryable);
  console.log(validationErr.code);
  
  console.log("----------------");
  
  const rateLimitErr = new RateLimitError();
  
  console.log("Rate Limit Error:");
  console.log(rateLimitErr.name);
  console.log(rateLimitErr.message);
  console.log(rateLimitErr.retryable);
  console.log(rateLimitErr.code);