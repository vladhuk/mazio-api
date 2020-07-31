import { Types } from 'mongoose';

export default class MazeNotFoundError extends Error {
  constructor(mazeId: Types.ObjectId) {
    super(`Maze with id ${mazeId} is not found.`);
  }
}
