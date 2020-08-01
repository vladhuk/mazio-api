import {
  Schema,
  Document,
  model,
  Types,
  Model,
  QueryPopulateOptions,
} from 'mongoose';
import { values } from '../../utils/enum';
import InfoSchema, { IInfo } from './subdocs/InfoSchema';
import StructureSchema, { IStructure } from './subdocs/StructureSchema';
import User, { IUser, IUserDto } from '../User';
import FieldsNotPopulatedError from '../../errors/FieldsNotPopulatedError';
import MazeNotFoundError from '../../errors/MazeNotFoundError';
import QueryOptions from '../../../@types/QueryOptions';

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

interface IMazeModel extends Model<IMaze> {
  toDto(user: IMaze): IMazeDto;

  getById(id: Types.ObjectId, opts?: QueryOptions): Promise<IMaze>;
  getByOwnerIdAndType(
    ownerId: Types.ObjectId,
    type: Type,
    opts?: QueryOptions
  ): Promise<IMaze[]>;
}

export enum Type {
  DRAFT,
  PUBLISHED,
}

const mazeSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    games: { type: Number, min: 0, default: 0 },
    type: { type: Number, enum: values(Type), default: Type.DRAFT },
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

mazeSchema.statics.getById = async function (
  this: Model<IMaze>,
  id: Types.ObjectId,
  { populate = true, lean = true } = {}
): Promise<IMaze> {
  const query = this.findById(id);

  populate && query.populate(defaultPopulateOptions);
  lean && query.lean();

  const maze = await query.exec();

  if (!maze) {
    throw new MazeNotFoundError(id);
  }

  return maze;
};

mazeSchema.statics.getByOwnerIdAndType = async function (
  this: Model<IMaze>,
  ownerId: Types.ObjectId,
  type: Type,
  { populate = true, lean = true } = {}
): Promise<IMaze[]> {
  const query = this.find({ owner: ownerId, type: type });

  populate && query.populate(defaultPopulateOptions);
  lean && query.lean();

  return query.exec();
};

export default model<IMaze, IMazeModel>('Maze', mazeSchema);
