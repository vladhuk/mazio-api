export default abstract class HttpError extends Error {
  constructor(message: string) {
    super(message);
  }

  abstract getHttpStatusCode(): number;
}
