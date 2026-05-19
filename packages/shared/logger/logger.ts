type LogLevel =
  | "INFO"
  | "WARN"
  | "ERROR";

export class Logger {

  private formatMessage(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>
  ) {

    return JSON.stringify({
      timestamp:
        new Date().toISOString(),

      level,

      message,

      metadata:
        metadata || {}
    });
  }

  info(
    message: string,
    metadata?: Record<string, any>
  ) {

    console.log(
      this.formatMessage(
        "INFO",
        message,
        metadata
      )
    );
  }

  warn(
    message: string,
    metadata?: Record<string, any>
  ) {

    console.warn(
      this.formatMessage(
        "WARN",
        message,
        metadata
      )
    );
  }

  error(
    message: string,
    metadata?: Record<string, any>
  ) {

    console.error(
      this.formatMessage(
        "ERROR",
        message,
        metadata
      )
    );
  }
}