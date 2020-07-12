import { Schema, Document, Types, model } from 'mongoose';
import { values } from '../../utils/enum';
import InfoSchema, { IInfo } from './InfoSchema';
import StructureSchema, { IStructure } from './StructureSchema';
import { IUser } from '../User';

export interface IMaze extends Document {
  title: string;
  owner: IUser;
  likes: number;
  dislikes: number;
  games: number;
  type: number;
  info: IInfo;
  structure: IStructure;
}

enum Type {
  DRAFT,
  PUBLISHED,
}

const mazeSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    owner: { type: Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, min: 0, default: 0 },
    dislikes: { type: Number, min: 0, default: 0 },
    games: { type: Number, min: 0, default: 0 },
    type: { type: Number, enum: values(Type), default: Type.DRAFT },
    info: InfoSchema,
    structure: StructureSchema,
  },
  {
    timestamps: true,
  }
);

export default model('Maze', mazeSchema);
