import User, { IUserDto } from '../models/User';
import UserNotFoundError from '../errors/UserNotFoundError';
import { Types } from 'mongoose';

export async function getFriends(userId: Types.ObjectId): Promise<IUserDto[]> {
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

  return user.friends.map(User.leanToDto);
}

export async function addFriend(
  userId: Types.ObjectId,
  friendUsername: string
): Promise<IUserDto[]> {
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

  if (!friendExists) {
    const newFriend = await User.findOne({ username: friendUsername }).select({
      username: true,
    });

    if (!newFriend) {
      throw new UserNotFoundError(undefined, friendUsername);
    }

    user.friends.push(newFriend);
    await user.save();
  }

  return user.friends.map(User.leanToDto);
}

export async function deleteFriend(
  userId: Types.ObjectId,
  friendId: Types.ObjectId
): Promise<void> {
  return User.updateOne({ _id: userId }, { $pull: { friends: friendId } });
}

export async function getIgnoredUsers(
  userId: Types.ObjectId
): Promise<IUserDto[]> {
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

  return user.ignoredUsers.map(User.leanToDto);
}

export async function addIgnoredUser(
  userId: Types.ObjectId,
  ignoredUserUsername: string
): Promise<IUserDto[]> {
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

  if (!ignoredUserExists) {
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

  return user.ignoredUsers.map(User.leanToDto);
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
