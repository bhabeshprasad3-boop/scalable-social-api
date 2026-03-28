class ApiError extends Error {
  statusCode: number;
  success: boolean;
  error: string[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    error: string[] = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
