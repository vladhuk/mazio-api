import User, { IUser } from '../models/User';
import UserNotFoundError from '../errors/UserNotFoundError';
import { Types } from 'mongoose';
import logger from '../utils/logger';
import { incrementLikes, incrementDislikes } from './MazeService';
import { IMaze } from '../models/Maze';

const log = logger.child({ servise: 'UserService' });

export async function getFriends(userId: Types.ObjectId): Promise<IUser[]> {
  const user = await User.findById(userId)
    .select({
      _id: false,
      friends: true,
    })
    .populate({ path: 'friends', select: { username: true } })
    .lean();

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  return user.friends;
}

export async function addFriend(
  userId: Types.ObjectId,
  friendUsername: string
): Promise<IUser[]> {
  const user = await User.findById(userId)
    .select({
      friends: true,
    })
    .populate({ path: 'friends', select: { username: true } });

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  const friendExists = user.friends
    .map((friend) => friend.username)
    .includes(friendUsername);

  if (friendExists) {
    log.warn(
      `User with username '${friendUsername}' is already friend of user with id ${userId}.`
    );
  } else {
    const newFriend = await User.findOne({ username: friendUsername }).select({
      username: true,
    });

    if (!newFriend) {
      throw new UserNotFoundError(undefined, friendUsername);
    }

    user.friends.push(newFriend);
    await user.save();
  }

  return user.friends;
}

export async function deleteFriend(
  userId: Types.ObjectId,
  friendId: Types.ObjectId
): Promise<void> {
  return User.updateOne({ _id: userId }, { $pull: { friends: friendId } });
}

export async function getIgnoredUsers(
  userId: Types.ObjectId
): Promise<IUser[]> {
  const user = await User.findById(userId)
    .select({
      _id: false,
      ignoredUsers: true,
    })
    .populate({ path: 'ignoredUsers', select: { username: true } })
    .lean();

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  return user.ignoredUsers;
}

export async function addIgnoredUser(
  userId: Types.ObjectId,
  ignoredUserUsername: string
): Promise<IUser[]> {
  const user = await User.findById(userId)
    .select({
      ignoredUsers: true,
    })
    .populate({ path: 'ignoredUsers', select: { username: true } });

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  const ignoredUserExists = user.ignoredUsers
    .map((ignoredUser) => ignoredUser.username)
    .includes(ignoredUserUsername);

  if (ignoredUserExists) {
    log.warn(
      `User with username '${ignoredUserUsername}' is already ignored by user with id ${userId}.`
    );
  } else {
    const newIgnoredUser = await User.findOne({
      username: ignoredUserUsername,
    }).select({
      username: true,
    });

    if (!newIgnoredUser) {
      throw new UserNotFoundError(undefined, ignoredUserUsername);
    }

    user.ignoredUsers.push(newIgnoredUser);
    await user.save();
  }

  return user.ignoredUsers;
}

export async function deleteIgnoredUser(
  userId: Types.ObjectId,
  ignoredUserId: Types.ObjectId
): Promise<void> {
  return User.updateOne(
    { _id: userId },
    { $pull: { ignoredUsers: ignoredUserId } }
  );
}

async function getUserWithLikedMazes(userId: Types.ObjectId): Promise<IUser> {
  const user = await User.findById(userId)
    .select({ likedMazes: true })
    .populate({
      path: 'likedMazes',
      populate: { path: 'owner', select: { username: true } },
    });

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  return user;
}

async function getUserWithDislikedMazes(
  userId: Types.ObjectId
): Promise<IUser> {
  const user = await User.findById(userId)
    .select({ dislikedMazes: true })
    .populate({
      path: 'dislikedMazes',
      populate: { path: 'owner', select: { username: true } },
    });

  if (!user) {
    throw new UserNotFoundError(userId);
  }

  return user;
}

export async function addLikedMazeAndUpdateMazeLikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<IMaze[]> {
  const user = await getUserWithLikedMazes(userId);

  const likedMazeExists = user.likedMazes
    .map((likedMaze) => likedMaze._id)
    .includes(mazeId.toString());

  if (likedMazeExists) {
    log.warn(`Maze ${mazeId} already liked by user ${userId}.`);
    return user.likedMazes;
  }

  await incrementLikes(mazeId, 1);
  await user.update({ $push: { likedMazes: mazeId } });

  return user.likedMazes;
}

export async function removeLikedMazeAndUpdateMazeLikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<IMaze[]> {
  const user = await getUserWithLikedMazes(userId);

  const likedMazeExists = user.likedMazes
    .map((likedMaze) => likedMaze._id)
    .includes(mazeId.toString());

  if (!likedMazeExists) {
    log.warn(`Maze ${mazeId} was not be liked by user ${userId}.`);
    return user.likedMazes;
  }

  await incrementLikes(mazeId, -1);
  await user.update({ $pull: { likedMazes: mazeId } });

  return user.likedMazes;
}

export async function addDislikedMazeAndUpdateMazeDislikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<IMaze[]> {
  const user = await getUserWithDislikedMazes(userId);

  const dislikedMazeExists = user.dislikedMazes
    .map((dislikedMaze) => dislikedMaze._id)
    .includes(mazeId.toString());

  if (dislikedMazeExists) {
    log.warn(`Maze ${mazeId} already disliked by user ${userId}.`);
    return user.dislikedMazes;
  }

  await incrementDislikes(mazeId, 1);
  await user.update({ $push: { dislikedMazes: mazeId } });

  return user.dislikedMazes;
}

export async function removeDislikedMazeAndUpdateMazeDislikesNumber(
  userId: Types.ObjectId,
  mazeId: Types.ObjectId
): Promise<IMaze[]> {
  const user = await getUserWithDislikedMazes(userId);

  const dislikedMazeExists = user.dislikedMazes
    .map((dislikedMaze) => dislikedMaze._id)
    .includes(mazeId.toString());

  if (!dislikedMazeExists) {
    log.warn(`Maze ${mazeId} was not be disliked by user ${userId}.`);
    return user.dislikedMazes;
  }

  await incrementDislikes(mazeId, -1);
  await user.update({ $pull: { dislikedMazes: mazeId } });

  return user.dislikedMazes;
}
