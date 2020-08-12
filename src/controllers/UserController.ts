import { RequestHandler } from 'express';
import * as userService from '../services/UserService';
import * as mazeService from '../services/MazeService';
import { Types } from 'mongoose';
import User from '../models/User';
import Maze, { Type as MazeType } from '../models/Maze';
import { getDefaultErrorHandler } from '../utils/errorHandlers';

const defaultErrorHandler = getDefaultErrorHandler('UserController');

export const getFriends: RequestHandler = (req, res) => {
  userService
    .getFriends(Types.ObjectId(req.params.id))
    .then((users) => users.map(User.toDto))
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const addFriend: RequestHandler = (req, res) => {
  userService
    .addFriend(Types.ObjectId(req.params.id), req.body.username)
    .then(User.toDto)
    .then(res.json)
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
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const addIgnoredUser: RequestHandler = (req, res) => {
  userService
    .addIgnoredUser(Types.ObjectId(req.params.id), req.body.username)
    .then(User.toDto)
    .then(res.json)
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

export const getLikedMazes: RequestHandler = (req, res) => {
  userService
    .getLikedMazes(Types.ObjectId(req.params.id))
    .then((mazes) => mazes.map(Maze.toDto))
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const addLikedMaze: RequestHandler = (req, res) => {
  userService
    .addLikedMazeAndUpdateMazeLikesNumber(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.body.id)
    )
    .then(Maze.toDto)
    .then(res.json)
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

export const getDislikedMazes: RequestHandler = (req, res) => {
  userService
    .getDislikedMazes(Types.ObjectId(req.params.id))
    .then((mazes) => mazes.map(Maze.toDto))
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const addDislikedMaze: RequestHandler = (req, res) => {
  userService
    .addDislikedMazeAndUpdateMazeDislikesNumber(
      Types.ObjectId(req.params.id),
      Types.ObjectId(req.body.id)
    )
    .then(Maze.toDto)
    .then(res.json)
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

export const getMazes: RequestHandler = (req, res) => {
  const mazeType = req.query.type ? <MazeType>req.query.type : null;
  const userId = Types.ObjectId(req.params.id);

  const promisedUsers = mazeType
    ? mazeService.getMazesByOwnerIdAndType(userId, mazeType)
    : mazeService.getMazesByOwnerId(userId);

  promisedUsers
    .then((mazes) => mazes.map(Maze.toDto))
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const getMaze: RequestHandler = (req, res) => {
  mazeService
    .getMazeByIdAndOwnerId(
      Types.ObjectId(req.params.mazeId),
      Types.ObjectId(req.params.id)
    )
    .then(Maze.toDto)
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const createMaze: RequestHandler = (req, res) => {
  mazeService
    .createMaze(req.body, Types.ObjectId(req.params.id))
    .then(Maze.toDto)
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const updateMaze: RequestHandler = (req, res) => {
  mazeService
    .updateMaze(
      Types.ObjectId(req.params.mazeId),
      req.body,
      Types.ObjectId(req.params.id)
    )
    .then(Maze.toDto)
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const deleteMaze: RequestHandler = (req, res) => {
  mazeService
    .deleteMaze(
      Types.ObjectId(req.params.mazeId),
      Types.ObjectId(req.params.id)
    )
    .then(() => res.end())
    .catch((err) => defaultErrorHandler(err, res));
};

export const publishMaze: RequestHandler = (req, res) => {
  mazeService
    .publishMaze(req.body, Types.ObjectId(req.params.id))
    .then(Maze.toDto)
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};
