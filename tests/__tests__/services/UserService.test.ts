import User, { IUser } from '../../../src/models/User';
import {
  getFriends,
  getIgnoredUsers,
  addFriend,
  addIgnoredUser,
  deleteFriend,
  deleteIgnoredUser,
  addLikedMazeAndUpdateMazeLikesNumber,
  removeLikedMazeAndUpdateMazeLikesNumber,
  addDislikedMazeAndUpdateMazeDislikesNumber,
  removeDislikedMazeAndUpdateMazeDislikesNumber,
  getLikedMazes,
  getDislikedMazes,
} from '../../../src/services/UserService';
import UserNotFoundError from '../../../src/errors/UserNotFoundError';
import { Types } from 'mongoose';
import Maze, { IMaze } from '../../../src/models/Maze';
import MazeNotFoundError from '../../../src/errors/MazeNotFoundError';
import { getMazeById } from '../../../src/services/MazeService';
import BadRequestError from '../../../src/errors/http/BadRequestError';

const testUser1 = { username: 'testusername1', password: 'testpassword1' };
const testUser2 = { username: 'testusername2', password: 'testpassword2' };

let testUserModel: IUser;
let testMazeModel: IMaze;

const testMazeSnippet = {
  title: 'testMaze1',
  info: {
    bullets: 0,
    bulletsOnStart: 0,
    granades: 0,
    granadesOnStart: 0,
  },
  structure: {
    size: { height: 5, width: 5 },
    walls: [],
    outputs: [],
    treasure: { x: 0, y: 0 },
    spawns: [],
  },
};

beforeEach(() => {
  testUserModel = new User({
    username: 'testusername',
    password: 'testpassword',
  });
  testMazeModel = new Maze({ ...testMazeSnippet, owner: testUserModel });
});

it('getFriends(). When: user and friend exist. Expected: list with friend', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User({ ...testUser1, friends: [friendUser] });
  await user.save();

  const friends = await getFriends(user._id);

  expect(friends).not.toBeNull();
  expect(friends.length).toBe(1);
  expect(friends[0]._id).toEqual(friendUser._id);
});

it('getFriends(). When: user does not exist. Expected: UserNotFoundError', () => {
  const id = Types.ObjectId();
  return expect(getFriends(id)).rejects.toEqual(new UserNotFoundError(id));
});

it('addFriend(). When: user exists and does not have this friend. Expected: add friend', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User(testUser1);
  await user.save();

  const friend = await addFriend(user._id, friendUser.username);
  const friends = await getFriends(user._id);

  expect(friends.length).toBe(1);
  expect(friend._id).toEqual(friendUser._id);
});

it('addFriend(). When: friend does not exist. Expected: UserNotFoundError', async () => {
  const user = new User(testUser1);
  await user.save();

  return expect(addFriend(user._id, testUser2.username)).rejects.toEqual(
    new UserNotFoundError(undefined, testUser2.username)
  );
});

it('addFriend(). When: friend already added. Expected: BadRequestError', async () => {
  const friendUser = new User(testUser2);
  await friendUser.save();
  const user = new User({ ...testUser1, friends: [friendUser] });
  await user.save();

  return expect(
    addFriend(user._id, friendUser.username)
  ).rejects.toBeInstanceOf(BadRequestError);
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

it('getIgnoredUsers(). When: user and and ignored user exist. Expected: list with ignores users', async () => {
  const ignoredUser = new User(testUser2);
  await ignoredUser.save();
  const user = new User({ ...testUser1, ignoredUsers: [ignoredUser] });
  await user.save();

  const ignoredUsers = await getIgnoredUsers(user._id);

  expect(ignoredUsers.length).toBe(1);
  expect(ignoredUsers[0]._id).toEqual(ignoredUser._id);
});

it('addIgnoredUser(). When: user exists and does not have this ignored user. Expected: add ignored user', async () => {
  const ignoredUser = new User(testUser2);
  await ignoredUser.save();
  const user = new User(testUser1);
  await user.save();

  const ignored = await addIgnoredUser(user._id, ignoredUser.username);
  const ignoredUsers = await getIgnoredUsers(user._id);

  expect(ignoredUsers.length).toBe(1);
  expect(ignored._id).toEqual(ignoredUser._id);
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

it('addLikedMazeAndUpdateMazeLikesNumber(). When: maze is not liked. Expected: new liked maze and increase number of likes', async () => {
  await Promise.all([testUserModel.save(), testMazeModel.save()]);

  const likedMaze = await addLikedMazeAndUpdateMazeLikesNumber(
    testUserModel._id,
    testMazeModel._id
  );
  const likedMazes = await getLikedMazes(testUserModel._id);

  expect(likedMazes.length).toBe(1);
  expect(likedMaze.likes).toBe(1);
});

it('addLikedMazeAndUpdateMazeLikesNumber(). When: maze is liked. Expected: BadRequestError', async () => {
  await Promise.all([testUserModel.save(), testMazeModel.save()]);

  await addLikedMazeAndUpdateMazeLikesNumber(
    testUserModel._id,
    testMazeModel._id
  );

  return expect(
    addLikedMazeAndUpdateMazeLikesNumber(testUserModel._id, testMazeModel._id)
  ).rejects.toBeInstanceOf(BadRequestError);
});

it('addLikedMazeAndUpdateMazeLikesNumber(). When: user does not exist. Expected: UserNotFoundError', async () => {
  await testMazeModel.save();

  const id = Types.ObjectId();

  return expect(
    addLikedMazeAndUpdateMazeLikesNumber(id, testMazeModel._id)
  ).rejects.toEqual(new UserNotFoundError(id));
});

it('addLikedMazeAndUpdateMazeLikesNumber(). When: maze does not exist. Expected: MazeNotFoundError', async () => {
  await testUserModel.save();
  const id = Types.ObjectId();

  return expect(
    addLikedMazeAndUpdateMazeLikesNumber(testUserModel._id, id)
  ).rejects.toEqual(new MazeNotFoundError(id));
});

it('removeLikedMazeAndUpdateMazeLikesNumber(). When: maze is liked. Expected: no liked mazes and 0 likes in maze', async () => {
  await Promise.all([testUserModel.save(), testMazeModel.save()]);

  await addLikedMazeAndUpdateMazeLikesNumber(
    testUserModel._id,
    testMazeModel._id
  );
  await removeLikedMazeAndUpdateMazeLikesNumber(
    testUserModel._id,
    testMazeModel._id
  );
  const likedMazes = await getLikedMazes(testUserModel._id);
  const likedMaze = await getMazeById(testMazeModel._id);

  expect(likedMazes.length).toBe(0);
  expect(likedMaze.likes).toBe(0);
});

it('removeLikedMazeAndUpdateMazeLikesNumber(). When: maze is not liked. Expected: BadRequestError', async () => {
  await Promise.all([testUserModel.save(), testMazeModel.save()]);

  return expect(
    removeLikedMazeAndUpdateMazeLikesNumber(
      testUserModel._id,
      testMazeModel._id
    )
  ).rejects.toBeInstanceOf(BadRequestError);
});

it('addDislikedMazeAndUpdateMazeDislikesNumber(). When: maze is not disliked. Expected: new disliked maze and increase number of dislikes', async () => {
  await Promise.all([testUserModel.save(), testMazeModel.save()]);

  const dislikedMaze = await addDislikedMazeAndUpdateMazeDislikesNumber(
    testUserModel._id,
    testMazeModel._id
  );
  const dislikedMazes = await getDislikedMazes(testUserModel._id);

  expect(dislikedMazes.length).toBe(1);
  expect(dislikedMaze.dislikes).toBe(1);
});

it('removeDislikedMazeAndUpdateMazeDislikesNumber(). When: maze is disliked. Expected: no disliked mazes and 0 dislikes in maze', async () => {
  await Promise.all([testUserModel.save(), testMazeModel.save()]);

  await addDislikedMazeAndUpdateMazeDislikesNumber(
    testUserModel._id,
    testMazeModel._id
  );
  await removeDislikedMazeAndUpdateMazeDislikesNumber(
    testUserModel._id,
    testMazeModel._id
  );
  const dislikedMazes = await getDislikedMazes(testUserModel._id);
  const dislikedMaze = await getMazeById(testMazeModel._id);

  expect(dislikedMazes.length).toBe(0);
  expect(dislikedMaze.dislikes).toBe(0);
});
