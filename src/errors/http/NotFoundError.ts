import HttpError from './HttpError';
import HttpStatus from 'http-status-codes';

export default class NotFoundError extends HttpError {
  getHttpStatusCode(): number {
    return HttpStatus.NOT_FOUND;
  }
}
