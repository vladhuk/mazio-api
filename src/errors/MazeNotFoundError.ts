import { Types } from 'mongoose';
import NotFoundError from './http/NotFoundError';

export default class MazeNotFoundError extends NotFoundError {
  constructor(mazeId: Types.ObjectId) {
    super(`Maze with id ${mazeId} is not found.`);
  }
}
