class AppError {
  statusCode: number;
  message: string;
  details: string | {};

  constructor(statusCode: number, message: string, details: string | {}) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }
}

export default AppError;
