import { Types } from 'mongoose';
import { Type as MazeType, IMaze } from '../models/Maze';
import Maze from '../models/Maze/Maze';
import User from '../models/User';
import MazeNotFoundError from '../errors/MazeNotFoundError';

export async function getMazesByOwnerAndType(
  ownerId: Types.ObjectId,
  mazeType: MazeType
): Promise<IMaze[]> {
  return Maze.find({ owner: ownerId, type: mazeType }).lean();
}

export async function createMaze(
  maze: IMaze,
  ownerId: Types.ObjectId
): Promise<IMaze> {
  const owner = await User.findById(ownerId);

  const newMaze = new Maze({
    title: maze.title,
    info: maze.info,
    structure: maze.structure,
    owner,
    type: MazeType.DRAFT,
  });

  return newMaze.save();
}

export async function updateMaze(
  mazeId: Types.ObjectId,
  maze: IMaze
): Promise<IMaze> {
  const currentMaze = await Maze.findById(mazeId).select({
    title: true,
    info: true,
    structure: true,
  });

  if (!currentMaze) {
    throw new MazeNotFoundError(mazeId);
  }

  if (maze.title) {
    currentMaze.title = maze.title;
  }
  if (maze.info) {
    currentMaze.info = maze.info;
  }
  if (maze.structure) {
    currentMaze.structure = maze.structure;
  }

  return currentMaze.save();
}

export async function incrementLikes(
  mazeId: Types.ObjectId,
  diff: number
): Promise<number> {
  const maze = await Maze.findByIdAndUpdate(
    mazeId,
    { $inc: { likes: diff } },
    { new: true }
  ).select({ _id: false, likes: true });

  if (!maze) {
    throw new MazeNotFoundError(mazeId);
  }

  return maze.likes;
}

export async function incrementDislikes(
  mazeId: Types.ObjectId,
  diff: number
): Promise<number> {
  const maze = await Maze.findByIdAndUpdate(
    mazeId,
    { $inc: { likes: diff } },
    { new: true }
  ).select({ _id: false, dislikes: true });

  if (!maze) {
    throw new MazeNotFoundError(mazeId);
  }

  return maze.dislikes;
}
