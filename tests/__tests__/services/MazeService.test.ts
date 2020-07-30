import Maze, { Type } from '../../../src/models/Maze';
import User, { IUser } from '../../../src/models/User';
import {
  getMazesByOwnerAndType,
  createMaze,
  incrementLikes,
  incrementDislikes,
} from '../../../src/services/MazeService';

let testUserModel: IUser;

const testMazeSnippet = {
  title: 'testMaze1',
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

beforeEach(() => {
  testUserModel = new User({
    username: 'testusername',
    password: 'testpassword',
  });
  testMazeSnippet.owner = testUserModel._id;
});

it('getMazesByOwnerAndType(). When: type is published mazes. Expected: only published mazes', async () => {
  await testUserModel.save();
  const publishedMaze = new Maze({ ...testMazeSnippet, type: Type.PUBLISHED });
  const draftMaze = new Maze({ ...testMazeSnippet, title: 'draftMaze' });
  await Maze.create(publishedMaze, draftMaze);

  const publishedMazes = await getMazesByOwnerAndType(
    testUserModel._id,
    Type.PUBLISHED
  );

  expect(publishedMazes.length).toBe(1);
  expect(publishedMazes[0]._id).toEqual(publishedMaze._id);
  expect((<IUser>publishedMaze.owner)._id).toEqual(testUserModel._id);
});

it('createMaze(). When: owner exists. Expect: correct creating', async () => {
  await testUserModel.save();
  const maze = await createMaze(new Maze(testMazeSnippet), testUserModel._id);

  expect(maze._id).toBeDefined();
  expect((<IUser>maze.owner)._id).toEqual(testUserModel._id);
});

it('incrementLikes(). When: maze exist. Expect: correct increment', async () => {
  const maze = await new Maze(testMazeSnippet).save();
  const expectedLikes = maze.likes + 1;
  const incrementedLikes = await incrementLikes(maze._id, 1);
  const updatedMaze = await Maze.findById(maze._id)
    .select({ _id: false, likes: true })
    .lean();

  expect(incrementedLikes).toBe(expectedLikes);
  expect(updatedMaze?.likes).toBe(expectedLikes);
});

it('incrementDislikes(). When: maze exist. Expect: correct increment', async () => {
  const maze = await new Maze(testMazeSnippet).save();
  const expectedDislikes = maze.dislikes + 1;
  const incrementedDisikes = await incrementDislikes(maze._id, 1);
  const updatedMaze = await Maze.findById(maze._id)
    .select({ _id: false, dislikes: true })
    .lean();

  expect(incrementedDisikes).toBe(expectedDislikes);
  expect(updatedMaze?.dislikes).toBe(expectedDislikes);
});
