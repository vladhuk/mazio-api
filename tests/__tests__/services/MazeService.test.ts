import Maze, { Type } from '../../../src/models/Maze';
import User, { IUser } from '../../../src/models/User';
import {
  getMazesByOwnerIdAndType,
  createMaze,
  incrementLikes,
  incrementDislikes,
  publishMaze,
} from '../../../src/services/MazeService';
import BadRequestError from '../../../src/errors/http/BadRequestError';

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
  testMazeSnippet.owner = testUserModel;
});

it('getMazesByOwnerIdAndType(). When: type is published mazes. Expected: only published mazes', async () => {
  await testUserModel.save();
  const publishedMaze = new Maze({ ...testMazeSnippet, type: Type.PUBLISHED });
  const draftMaze = new Maze({ ...testMazeSnippet, title: 'draftMaze' });
  await Maze.create(publishedMaze, draftMaze);

  const publishedMazes = await getMazesByOwnerIdAndType(
    testUserModel._id,
    Type.PUBLISHED
  );

  expect(publishedMazes.length).toBe(1);
  expect(publishedMazes[0]._id).toEqual(publishedMaze._id);
  expect((<IUser>publishedMaze.owner)._id).toEqual(testUserModel._id);
});

it('createMaze(). When: owner exists. Expected: correct creating', async () => {
  await testUserModel.save();
  const maze = await createMaze(new Maze(testMazeSnippet), testUserModel._id);

  expect(maze._id).toBeDefined();
  expect((<IUser>maze.owner)._id).toEqual(testUserModel._id);
});

it('publishMaze(). When: maze is draft. Expected: new published maze will created.', async () => {
  await testUserModel.save();
  const maze = await new Maze(testMazeSnippet).save();

  const publishedMaze = await publishMaze(maze._id, testUserModel._id);

  expect(publishedMaze._id).not.toEqual(maze._id);
  expect(publishedMaze.type).toBe(Type.PUBLISHED);
  expect((await Maze.find()).length).toBe(2);
});

it('publishMaze(). When: maze is not a draft. Expected: new published maze will created.', async () => {
  const maze = new Maze({ ...testMazeSnippet, type: Type.PUBLISHED });
  await maze.save();

  return expect(
    publishMaze(maze._id, testUserModel._id)
  ).rejects.toBeInstanceOf(BadRequestError);
});

it('incrementLikes(). When: maze exist. Expected: correct increment', async () => {
  const maze = await new Maze(testMazeSnippet).save();
  const expectedLikes = maze.likes + 1;
  const incrementedLikes = await incrementLikes(maze._id, 1);
  const updatedMaze = await Maze.findById(maze._id)
    .select({ _id: false, likes: true })
    .lean();

  expect(incrementedLikes).toBe(expectedLikes);
  expect(updatedMaze?.likes).toBe(expectedLikes);
});

it('incrementDislikes(). When: maze exist. Expected: correct increment', async () => {
  const maze = await new Maze(testMazeSnippet).save();
  const expectedDislikes = maze.dislikes + 1;
  const incrementedDisikes = await incrementDislikes(maze._id, 1);
  const updatedMaze = await Maze.findById(maze._id)
    .select({ _id: false, dislikes: true })
    .lean();

  expect(incrementedDisikes).toBe(expectedDislikes);
  expect(updatedMaze?.dislikes).toBe(expectedDislikes);
});
