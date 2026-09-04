export class ApiException extends Error {
  name: 'HttpError';
  status: string | undefined;

  constructor(message: string, statusCode: string | undefined) {
    super(message);
    this.name = 'HttpError';
    this.status = statusCode;
  }
}
