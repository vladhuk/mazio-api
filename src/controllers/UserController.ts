import { RequestHandler, Response } from 'express';
import * as userService from '../services/UserService';
import { Types } from 'mongoose';
import HttpStatus from 'http-status-codes';
import UserNotFoundError from '../errors/UserNotFoundError';
import logger from '../utils/logger';

const log = logger.child({ service: 'UserController' });

function defaultErrorHandler(err: Error, res: Response) {
  log.error(err);

  if (err instanceof UserNotFoundError) {
    return res.status(HttpStatus.NOT_FOUND).send(err.message);
  }
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
}

export const getFriends: RequestHandler = (req, res) => {
  userService
    .getFriends(Types.ObjectId(req.params.id))
    .then((friends) => res.json(friends))
    .catch((err) => defaultErrorHandler(err, res));
};

export const addFriend: RequestHandler = (req, res) => {
  userService
    .addFriend(Types.ObjectId(req.params.id), req.body.username)
    .then((friends) => res.json(friends))
    .catch((err) => defaultErrorHandler(err, res));
};

export const deleteFriend: RequestHandler = (req, res) => {
  userService
    .deleteFriend(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.params.friendId)
    )
    .catch((err) => defaultErrorHandler(err, res));
};

export const getIgnoredUsers: RequestHandler = (req, res) => {
  userService
    .getIgnoredUsers(Types.ObjectId(req.params.id))
    .then((ignoredUsers) => res.json(ignoredUsers))
    .catch((err) => defaultErrorHandler(err, res));
};

export const addIgnoredUser: RequestHandler = (req, res) => {
  userService
    .addIgnoredUser(Types.ObjectId(req.params.id), req.body.username)
    .then((ignoredUsers) => res.json(ignoredUsers))
    .catch((err) => defaultErrorHandler(err, res));
};

export const deleteIgnoredUser: RequestHandler = (req, res) => {
  userService
    .deleteIgnoredUser(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.params.ignoredUserId)
    )
    .catch((err) => defaultErrorHandler(err, res));
};
