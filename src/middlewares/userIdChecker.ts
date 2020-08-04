import { RequestHandler } from 'express';
import HttpStatus from 'http-status-codes';

const userIdChecker: RequestHandler = (req, res, next) => {
  if (req.jwt?.sub !== req.params.id) {
    return res.status(HttpStatus.FORBIDDEN);
  }
  return next();
};

export default userIdChecker;
