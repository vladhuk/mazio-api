import {
  Schema,
  Document,
  model,
  Types,
  Model,
  QueryPopulateOptions,
  DocumentQuery,
} from 'mongoose';
import InfoSchema, { IInfo } from './subdocs/InfoSchema';
import StructureSchema, { IStructure } from './subdocs/StructureSchema';
import User, { IUser, IUserDto } from '../User';
import FieldsNotPopulatedError from '../../errors/FieldsNotPopulatedError';
import MazeNotFoundError from '../../errors/MazeNotFoundError';
import QueryOptions from '../../../@types/QueryOptions';
import NotFoundError from '../../errors/http/NotFoundError';

interface IMazeBase {
  title: string;
  likes: number;
  dislikes: number;
  games: number;
  type: Type;
  info: IInfo;
  structure: IStructure;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaze extends IMazeBase, Document {
  owner: IUser | Types.ObjectId;
}

export interface IMazeDto extends IMazeBase {
  id: string;
  owner: IUserDto;
}

interface QueryHelpers {
  handleDefault<T>(this: DocumentQuery<T, IMaze>, opts?: QueryOptions): T;
}

interface IMazeModel extends Model<IMaze, QueryHelpers> {
  toDto(user: IMaze): IMazeDto;

  getById(id: Types.ObjectId, opts?: QueryOptions): Promise<IMaze>;
  getByIdAndType(
    id: Types.ObjectId,
    type: Type,
    opts?: QueryOptions
  ): Promise<IMaze>;
  getByIdAndOwnerId(
    id: Types.ObjectId,
    ownerId: Types.ObjectId,
    opts?: QueryOptions
  ): Promise<IMaze>;
  getByOwnerIdAndType(
    ownerId: Types.ObjectId,
    type: Type,
    opts?: QueryOptions
  ): Promise<IMaze[]>;
  getByOwnerId(ownerId: Types.ObjectId, opts?: QueryOptions): Promise<IMaze[]>;
  getByType(type: Type, opts?: QueryOptions): Promise<IMaze[]>;
}

export enum Type {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

const mazeSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    games: { type: Number, min: 0, default: 0 },
    type: { type: String, enum: Object.values(Type), default: Type.DRAFT },
    info: { type: InfoSchema, required: true },
    structure: { type: StructureSchema, required: true },
  },
  {
    timestamps: true,
  }
);

mazeSchema.statics.toDto = function (maze: IMaze): IMazeDto {
  if (maze.owner instanceof Types.ObjectId) {
    throw new FieldsNotPopulatedError('owner');
  }

  return {
    id: maze._id,
    title: maze.title,
    owner: User.toDto(<IUser>maze.owner),
    likes: maze.likes,
    dislikes: maze.dislikes,
    games: maze.games,
    type: maze.type,
    info: maze.info,
    structure: maze.structure,
    createdAt: maze.createdAt,
    updatedAt: maze.updatedAt,
  };
};

export const defaultPopulateOptions: QueryPopulateOptions = {
  path: 'owner',
  select: { username: true },
};

mazeSchema.query.handleDefault = async function <T>(
  this: DocumentQuery<T, IMaze>,
  { populate = true, lean = true } = {}
): Promise<T> {
  populate && this.populate(defaultPopulateOptions);
  lean && this.lean();
  return this.exec();
};

mazeSchema.statics.getById = async function (
  this: IMazeModel,
  id: Types.ObjectId,
  opts?: QueryOptions
): Promise<IMaze> {
  const maze = this.findById(id).handleDefault(opts);

  if (!maze) {
    throw new MazeNotFoundError(id);
  }

  return maze;
};

mazeSchema.statics.getByIdAndType = async function (
  this: IMazeModel,
  id: Types.ObjectId,
  type: Type,
  opts?: QueryOptions
): Promise<IMaze> {
  const maze = this.findOne({ _id: id, type }).handleDefault(opts);

  if (!maze) {
    throw new NotFoundError(`Maze with id ${id} and type ${type} not found.`);
  }

  return maze;
};

mazeSchema.statics.getByIdAndOwnerId = async function (
  this: IMazeModel,
  id: Types.ObjectId,
  ownerId: Types.ObjectId,
  opts?: QueryOptions
): Promise<IMaze> {
  const maze = this.findOne({ _id: id, owner: ownerId }).handleDefault(opts);

  if (!maze) {
    throw new NotFoundError(
      `Maze with id ${id} and owner ${ownerId} not found.`
    );
  }

  return maze;
};

mazeSchema.statics.getByOwnerIdAndType = async function (
  this: IMazeModel,
  ownerId: Types.ObjectId,
  type: Type,
  opts?: QueryOptions
): Promise<IMaze[]> {
  return this.find({ owner: ownerId, type: type }).handleDefault(opts);
};

mazeSchema.statics.getByOwnerId = async function (
  this: IMazeModel,
  ownerId: Types.ObjectId,
  opts?: QueryOptions
): Promise<IMaze[]> {
  return this.find({ owner: ownerId }).handleDefault(opts);
};

mazeSchema.statics.getByType = async function (
  this: IMazeModel,
  type: Type,
  opts?: QueryOptions
): Promise<IMaze[]> {
  return this.find({ type: type }).handleDefault(opts);
};

export default model<IMaze, IMazeModel>('Maze', mazeSchema);
