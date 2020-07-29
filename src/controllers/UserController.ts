import { RequestHandler, Response } from 'express';
import * as userService from '../services/UserService';
import { Types } from 'mongoose';
import HttpStatus from 'http-status-codes';
import UserNotFoundError from '../errors/UserNotFoundError';
import logger from '../utils/logger';
import User from '../models/User';

const log = logger.child({ service: 'UserController' });

function defaultErrorHandler(err: Error, res: Response) {
  log.error(err);

  if (err instanceof UserNotFoundError) {
    return res.status(HttpStatus.NOT_FOUND).send(err.message);
  }
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
}

export const getFriends: RequestHandler = (req, res) => {
  userService
    .getFriends(Types.ObjectId(req.params.id))
    .then((users) => users.map(User.toDto))
    .then((friends) => res.json(friends))
    .catch((err) => defaultErrorHandler(err, res));
};

export const addFriend: RequestHandler = (req, res) => {
  userService
    .addFriend(Types.ObjectId(req.params.id), req.body.username)
    .then((users) => users.map(User.toDto))
    .then((friends) => res.json(friends))
    .catch((err) => defaultErrorHandler(err, res));
};

export const deleteFriend: RequestHandler = (req, res) => {
  userService
    .deleteFriend(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.params.friendId)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};

export const getIgnoredUsers: RequestHandler = (req, res) => {
  userService
    .getIgnoredUsers(Types.ObjectId(req.params.id))
    .then((users) => users.map(User.toDto))
    .then((ignoredUsers) => res.json(ignoredUsers))
    .catch((err) => defaultErrorHandler(err, res));
};

export const addIgnoredUser: RequestHandler = (req, res) => {
  userService
    .addIgnoredUser(Types.ObjectId(req.params.id), req.body.username)
    .then((users) => users.map(User.toDto))
    .then((ignoredUsers) => res.json(ignoredUsers))
    .catch((err) => defaultErrorHandler(err, res));
};

export const deleteIgnoredUser: RequestHandler = (req, res) => {
  userService
    .deleteIgnoredUser(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.params.ignoredUserId)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};

export const addLikedMaze: RequestHandler = (req, res) => {
  userService
    .addLikedMazeAndUpdateMazeLikesNumber(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.body.id)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};

export const removeLikedMaze: RequestHandler = (req, res) => {
  userService
    .removeLikedMazeAndUpdateMazeLikesNumber(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.params.mazeId)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};

export const addDislikedMaze: RequestHandler = (req, res) => {
  userService
    .addDislikedMazeAndUpdateMazeDislikesNumber(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.body.id)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};

export const removeDislikedMaze: RequestHandler = (req, res) => {
  userService
    .removeDislikedMazeAndUpdateMazeDislikesNumber(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.params.mazeId)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};
