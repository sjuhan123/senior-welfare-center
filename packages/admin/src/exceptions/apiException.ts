export class ApiException extends Error {
  name: 'HttpError';
  status: number | undefined;

  constructor(message: string, status: number | undefined) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
