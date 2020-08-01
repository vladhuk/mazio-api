import HttpError from './HttpError';

import HttpStatus from 'http-status-codes';

export default class BadRequestError extends HttpError {
  getHttpStatusCode(): number {
    return HttpStatus.BAD_REQUEST;
  }
}
