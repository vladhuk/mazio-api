import { Types } from 'mongoose';
import { Type as MazeType, IMaze } from '../models/Maze';
import Maze, { Type } from '../models/Maze/Maze';
import User from '../models/User';
import MazeNotFoundError from '../errors/MazeNotFoundError';
import UserNotFoundError from '../errors/UserNotFoundError';
import BadRequestError from '../errors/http/BadRequestError';

export async function getMazeById(id: Types.ObjectId): Promise<IMaze> {
  return Maze.getById(id);
}

export async function getMazeByIdAndType(
  id: Types.ObjectId,
  type: MazeType
): Promise<IMaze> {
  return Maze.getByIdAndType(id, type);
}

export async function getMazeByIdAndOwnerId(
  mazeId: Types.ObjectId,
  ownerId: Types.ObjectId
): Promise<IMaze> {
  return Maze.getByIdAndOwnerId(mazeId, ownerId);
}

export async function getMazesByOwnerIdAndType(
  ownerId: Types.ObjectId,
  mazeType: MazeType
): Promise<IMaze[]> {
  return Maze.getByOwnerIdAndType(ownerId, mazeType);
}

export async function getMazesByOwnerId(
  ownerId: Types.ObjectId
): Promise<IMaze[]> {
  return Maze.getByOwnerId(ownerId);
}

export async function getMazesByType(mazeType: MazeType): Promise<IMaze[]> {
  return getMazesByType(mazeType);
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
  maze: IMaze,
  ownerId: Types.ObjectId
): Promise<IMaze> {
  const currentMaze = await Maze.getByIdAndOwnerId(mazeId, ownerId, {
    lean: false,
  });

  if (currentMaze.type !== Type.DRAFT) {
    throw new BadRequestError(`Maze ${mazeId} is not a draft.`);
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

export async function deleteMaze(
  mazeId: Types.ObjectId,
  ownerId: Types.ObjectId
): Promise<void> {
  await Maze.deleteOne({ _id: mazeId, owner: ownerId });
}

export async function publishMaze(
  mazeId: Types.ObjectId,
  ownerId: Types.ObjectId
): Promise<IMaze> {
  const draftMaze = await Maze.getByIdAndOwnerId(mazeId, ownerId);

  if (draftMaze.type !== Type.DRAFT) {
    throw new BadRequestError(`Maze ${mazeId} is not a draft.`);
  }

  delete draftMaze._id;

  const publishedMaze = new Maze({ ...draftMaze, type: Type.PUBLISHED });

  return publishedMaze.save();
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
