import logger from './logger';
import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import HttpError from '../errors/http/HttpError';

export function getDefaultErrorHandler(
  serviceName: string
): (err: Error, res: Response) => void {
  const log = logger.child({ service: serviceName });

  return (err: Error, res: Response) => {
    log.error(err);

    if (err instanceof HttpError) {
      return res.status(err.getHttpStatusCode()).send(err.message);
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
  };
}
