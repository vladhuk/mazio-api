import { getDefaultErrorHandler } from '../utils/errorHandlers';
import { RequestHandler, Request } from 'express';
import * as mazeService from '../services/MazeService';
import HttpStatus from 'http-status-codes';
import Maze, { Type as MazeType } from '../models/Maze';
import { Types } from 'mongoose';

const defaultErrorHandler = getDefaultErrorHandler('MazeController');

function getMazeTypeFromRequest(req: Request): number | null {
  return req.query.type ? parseInt(<string>req.query.type) : null;
}

export const getMazes: RequestHandler = (req, res) => {
  const mazeType = getMazeTypeFromRequest(req);

  if (!mazeType || mazeType === MazeType.DRAFT) {
    return res.status(HttpStatus.FORBIDDEN).end();
  }

  mazeService
    .getMazesByType(MazeType.PUBLISHED)
    .then((mazes) => mazes.map(Maze.toDto))
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};

export const getMaze: RequestHandler = (req, res) => {
  const mazeType = getMazeTypeFromRequest(req);

  if (!mazeType || mazeType === MazeType.DRAFT) {
    return res.status(HttpStatus.FORBIDDEN).end();
  }

  mazeService
    .getMazeByIdAndType(Types.ObjectId(req.params.id), MazeType.PUBLISHED)
    .then(Maze.toDto)
    .then(res.json)
    .catch((err) => defaultErrorHandler(err, res));
};
