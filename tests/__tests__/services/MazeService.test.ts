import Maze, { Type } from '../../../src/models/Maze';
import User, { IUser } from '../../../src/models/User';
import {
  getMazesByOwnerAndType,
  createMaze,
  incrementLikes,
  incrementDislikes,
} from '../../../src/services/MazeService';

let testUser: IUser;

const testMazeSnippet = {
  owner: {},
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

const testMaze = { ...testMazeSnippet, title: 'testMaze1' };

beforeEach(() => {
  testUser = new User({
    username: 'testusername',
    password: 'testpassword',
  });
  testMaze.owner = testUser._id;
});

it('getMazesByOwnerAndType(). When: type is published mazes. Expected: only published mazes', async () => {
  await testUser.save();
  const publishedMaze = new Maze({ ...testMaze, type: Type.PUBLISHED });
  const draftMaze = new Maze({ ...testMaze, title: 'draftMaze' });
  await Maze.create(publishedMaze, draftMaze);

  const publishedMazes = await getMazesByOwnerAndType(
    testUser._id,
    Type.PUBLISHED
  );

  expect(publishedMazes.length).toBe(1);
  expect(publishedMazes[0]._id).toEqual(publishedMaze._id);
  expect((<IUser>publishedMaze.owner)._id).toEqual(testUser._id);
});

it('createMaze(). When: owner exists. Expect: correct creating', async () => {
  await testUser.save();
  const maze = await createMaze(new Maze(testMaze), testUser._id);

  expect(maze._id).toBeDefined();
  expect((<IUser>maze.owner)._id).toEqual(testUser._id);
});

it('incrementLikes(). When: maze exist. Expect: correct increment', async () => {
  const maze = await new Maze(testMaze).save();
  const expectedLikes = maze.likes + 1;
  const incrementedLikes = await incrementLikes(maze._id, 1);
  const updatedMaze = await Maze.findById(maze._id)
    .select({ _id: false, likes: true })
    .lean();

  expect(incrementedLikes).toBe(expectedLikes);
  expect(updatedMaze?.likes).toBe(expectedLikes);
});

it('incrementDislikes(). When: maze exist. Expect: correct increment', async () => {
  const maze = await new Maze(testMaze).save();
  const expectedDislikes = maze.dislikes + 1;
  const incrementedDisikes = await incrementDislikes(maze._id, 1);
  const updatedMaze = await Maze.findById(maze._id)
    .select({ _id: false, dislikes: true })
    .lean();

  expect(incrementedDisikes).toBe(expectedDislikes);
  expect(updatedMaze?.dislikes).toBe(expectedDislikes);
});
