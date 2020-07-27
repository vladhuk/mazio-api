import { Schema, Document, model, Types, Model } from 'mongoose';
import { values } from '../../utils/enum';
import InfoSchema, { IInfo } from './subdocs/InfoSchema';
import StructureSchema, { IStructure } from './subdocs/StructureSchema';
import User, { IUser, IUserDto } from '../User';
import FieldsNotPopulatedError from '../../errors/FieldsNotPopulatedError';

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

  toDto(): IMazeDto;
}

export interface IMazeDto extends IMazeBase {
  id: string;
  owner: IUserDto;
}

interface IMazeModel extends Model<IMaze> {
  toDto(user: IMaze): IMazeDto;
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

function convertToDto(maze: IMaze): IMazeDto {
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
}

mazeSchema.methods.toDto = function (this: IMaze): IMazeDto {
  return convertToDto(this);
};

mazeSchema.statics.toDto = function (maze: IMaze): IMazeDto {
  return convertToDto(maze);
};

export default model<IMaze, IMazeModel>('Maze', mazeSchema);
