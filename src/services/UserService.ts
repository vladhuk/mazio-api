import User, { IUser } from '../models/User';
import { Types } from 'mongoose';
import * as mazeService from './MazeService';
import { IMaze } from '../models/Maze';
import BadRequestError from '../errors/http/BadRequestError';

export async function getFriends(userId: Types.ObjectId): Promise<IUser[]> {
  const user = await User.getByIdWithFriends(userId);
  return user.friends;
}

export async function addFriend(
  userId: Types.ObjectId,
  friendUsername: string
): Promise<IUser> {
  const user = await User.getByIdWithFriends(userId, { lean: false });

  const friendExists = user.friends
    .map((friend) => friend.username)
    .includes(friendUsername);

  if (friendExists) {
    throw new BadRequestError(
      `User with username '${friendUsername}' is already friend of user with id ${userId}.`
    );
  }

  const newFriend = await User.getByUsername(friendUsername);
  user.friends.push(newFriend);
  await user.save();

  return newFriend;
}

export async function deleteFriend(
  userId: Types.ObjectId,
  friendId: Types.ObjectId
): Promise<void> {
  const user = await User.getByIdWithFriends(userId, {
    populate: false,
    lean: false,
  });
  user.friends.pull(friendId);
  await user.save();
}

export async function getIgnoredUsers(
  userId: Types.ObjectId
): Promise<IUser[]> {
  const user = await User.getByIdWithIgnoredUsers(userId);
  return user.ignoredUsers;
}

export async function addIgnoredUser(
  userId: Types.ObjectId,
  ignoredUserUsername: string
): Promise<IUser> {
  const user = await User.getByIdWithIgnoredUsers(userId, { lean: false });

  const ignoredUserExists = user.ignoredUsers
    .map((ignoredUser) => ignoredUser.username)
    .includes(ignoredUserUsername);

  if (ignoredUserExists) {
    throw new BadRequestError(
      `User with username '${ignoredUserUsername}' is already ignored by user with id ${userId}.`
    );
  }

  const newIgnoredUser = await User.getByUsername(ignoredUserUsername);
  user.ignoredUsers.push(newIgnoredUser);
  await user.save();

  return newIgnoredUser;
}

export async function deleteIgnoredUser(
  userId: Types.ObjectId,
  ignoredUserId: Types.ObjectId
): Promise<void> {
  const user = await User.getByIdWithIgnoredUsers(userId, {
    populate: false,
    lean: false,
  });
  user.ignoredUsers.pull(ignoredUserId);
  await user.save();
}

export async function getLikedMazes(userId: Types.ObjectId): Promise<IMaze[]> {
  const user = await User.getByIdWithLikedMazes(userId);
  return user.likedMazes;
}

export async function addLikedMazeAndUpdateMazeLikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<IMaze> {
  const user = await User.getByIdWithLikedMazes(userId, {
    lean: false,
    populate: false,
  });

  const likedMazeExists = user.likedMazes
    .map((id) => id.toString())
    .includes(mazeId.toString());

  if (likedMazeExists) {
    throw new BadRequestError(
      `Maze ${mazeId} already liked by user ${userId}.`
    );
  }

  await mazeService.incrementLikes(mazeId, 1);

  const likedMaze = await mazeService.getMazeById(mazeId);
  user.likedMazes.push(likedMaze._id);
  await user.save();

  return likedMaze;
}

export async function removeLikedMazeAndUpdateMazeLikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<void> {
  const user = await User.getByIdWithLikedMazes(userId, {
    lean: false,
    populate: false,
  });

  const likedMazeExists = user.likedMazes
    .map((id) => id.toString())
    .includes(mazeId.toString());

  if (!likedMazeExists) {
    throw new BadRequestError(
      `Maze ${mazeId} was not be liked by user ${userId}.`
    );
  }

  await mazeService.incrementLikes(mazeId, -1);
  user.likedMazes.pull(mazeId);
  await user.save();
}

export async function getDislikedMazes(
  userId: Types.ObjectId
): Promise<IMaze[]> {
  const user = await User.getByIdWithDislikedMazes(userId);
  return user.dislikedMazes;
}

export async function addDislikedMazeAndUpdateMazeDislikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<IMaze> {
  const user = await User.getByIdWithDislikedMazes(userId, {
    lean: false,
    populate: false,
  });

  const dislikedMazeExists = user.dislikedMazes
    .map((id) => id.toString())
    .includes(mazeId.toString());

  if (dislikedMazeExists) {
    throw new BadRequestError(
      `Maze ${mazeId} already disliked by user ${userId}.`
    );
  }

  await mazeService.incrementDislikes(mazeId, 1);

  const dislikedMaze = await mazeService.getMazeById(mazeId);
  user.dislikedMazes.push(dislikedMaze._id);
  await user.save();

  return dislikedMaze;
}

export async function removeDislikedMazeAndUpdateMazeDislikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<void> {
  const user = await User.getByIdWithDislikedMazes(userId, {
    lean: false,
    populate: false,
  });

  const dislikedMazeExists = user.dislikedMazes
    .map((id) => id.toString())
    .includes(mazeId.toString());

  if (!dislikedMazeExists) {
    throw new BadRequestError(
      `Maze ${mazeId} was not be disliked by user ${userId}.`
    );
  }

  await mazeService.incrementDislikes(mazeId, -1);
  user.dislikedMazes.pull(mazeId);
  await user.save();
}
