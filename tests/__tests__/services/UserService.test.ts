import User from '../../../src/models/User';
import {
  getFriends,
  getIgnoredUsers,
  addFriend,
  addIgnoredUser,
  deleteFriend,
  deleteIgnoredUser,
} from '../../../src/services/UserService';
import UserNotFoundError from '../../../src/errors/UserNotFoundError';
import { Types } from 'mongoose';

const testUser1 = { username: 'testusername1', password: 'testpassword1' };
const testUser2 = { username: 'testusername2', password: 'testpassword2' };

it('getFriends(). When: user and friend exist. Expect: list with friend', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User({ ...testUser1, friends: [friendUser] });
  await user.save();

  const friends = await getFriends(user._id);

  expect(friends).not.toBeNull();
  expect(friends.length).toBe(1);
  expect(friends[0]._id).toEqual(friendUser._id);
});

it('getFriends(). When: user does not exist. Expect: UserNotFoundError', () => {
  const id = Types.ObjectId();
  return expect(getFriends(id)).rejects.toEqual(new UserNotFoundError(id));
});

it('addFriend(). When: user exists and does not have this friend. Expect: add friend', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User(testUser1);
  await user.save();

  const friends = await addFriend(user._id, friendUser.username);

  expect(friends).not.toBeNull();
  expect(friends.length).toBe(1);
  expect(friends[0]._id).toEqual(friendUser._id);
});

it('addFriend(). When: friend does not exist. Expect: UserNotFoundError', async () => {
  const user = new User(testUser1);
  await user.save();

  return expect(addFriend(user._id, testUser2.username)).rejects.toEqual(
    new UserNotFoundError(undefined, testUser2.username)
  );
});

it('addFriend(). When: friend already added. Expect: one friend', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User({ ...testUser1, friends: [friendUser] });
  await user.save();

  const friends = await addFriend(user._id, friendUser.username);

  expect(friends).not.toBeNull();
  expect(friends.length).toBe(1);
});

it('deleteFriend(). When: friend exists. Expected: deleted friend', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User({ ...testUser1, friends: [friendUser] });
  await user.save();

  await deleteFriend(user._id, friendUser._id);
  const friends = await getFriends(user._id);

  expect(friends.length).toBe(0);
});

it('getIgnoredUsers(). When: user and and inored user exist. Expect: list with ignores users', async () => {
  const ignoredUser = new User(testUser2);
  await ignoredUser.save();
  const user = new User({ ...testUser1, ignoredUsers: [ignoredUser] });
  await user.save();

  const ignoredUsers = await getIgnoredUsers(user._id);

  expect(ignoredUsers).not.toBeNull();
  expect(ignoredUsers.length).toBe(1);
  expect(ignoredUsers[0]._id).toEqual(ignoredUser._id);
});

it('addIgnoredUser(). When: user exists and does not have this ignored user. Expect: add ignored user', async () => {
  const ignoredUser = new User(testUser2);
  await ignoredUser.save();
  const user = new User(testUser1);
  await user.save();

  const ignoredUsers = await addIgnoredUser(user._id, ignoredUser.username);

  expect(ignoredUsers).not.toBeNull();
  expect(ignoredUsers.length).toBe(1);
  expect(ignoredUsers[0]._id).toEqual(ignoredUser._id);
});

it('deleteIgnoredUser(). When: ignored user exists. Expected: deleted ignored user', async () => {
  const ignoredUser = new User(testUser2);
  await ignoredUser.save();
  const user = new User({ ...testUser1, ignoredUsers: [ignoredUser] });
  await user.save();

  await deleteIgnoredUser(user._id, ignoredUser._id);
  const ignoredUsers = await getIgnoredUsers(user._id);

  expect(ignoredUsers.length).toBe(0);
});
