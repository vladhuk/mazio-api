import { Types } from 'mongoose';
import { Type as MazeType, IMaze } from '../models/Maze';
import Maze, { defaultPopulateOptions } from '../models/Maze/Maze';
import User from '../models/User';
import MazeNotFoundError from '../errors/MazeNotFoundError';
import UserNotFoundError from '../errors/UserNotFoundError';

export async function getMazeById(id: Types.ObjectId): Promise<IMaze> {
  const maze = await Maze.findById(id).populate(defaultPopulateOptions);

  if (!maze) {
    throw new MazeNotFoundError(id);
  }

  return maze;
}

export async function getMazesByOwnerAndType(
  ownerId: Types.ObjectId,
  mazeType: MazeType
): Promise<IMaze[]> {
  const isUserExist = await User.exists({ _id: ownerId });

  if (!isUserExist) {
    throw new UserNotFoundError(ownerId);
  }

  return Maze.find({ owner: ownerId, type: mazeType })
    .populate(defaultPopulateOptions)
    .lean();
}

export async function createMaze(
  maze: IMaze,
  ownerId: Types.ObjectId
): Promise<IMaze> {
  const isUserExists = await User.exists({ _id: ownerId });

  if (!isUserExists) {
    throw new UserNotFoundError(ownerId);
  }

  const newMaze = new Maze({
    title: maze.title,
    info: maze.info,
    structure: maze.structure,
    owner: ownerId,
    type: MazeType.DRAFT,
  });

  return newMaze.save();
}

export async function updateMaze(
  mazeId: Types.ObjectId,
  maze: IMaze
): Promise<IMaze> {
  const currentMaze = await getMazeById(mazeId);

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
  )
    .select({ _id: false, likes: true })
    .lean();

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
    { $inc: { dislikes: diff } },
    { new: true }
  )
    .select({ _id: false, dislikes: true })
    .lean();

  if (!maze) {
    throw new MazeNotFoundError(mazeId);
  }

  return maze.dislikes;
}
