import { Schema, Document, model } from 'mongoose';
import { values } from '../../utils/enum';
import InfoSchema, { IInfo } from './subdocs/InfoSchema';
import StructureSchema, { IStructure } from './subdocs/StructureSchema';
import { IUser } from '../User';

export interface IMaze extends Document {
  title: string;
  owner: IUser;
  likes: number;
  dislikes: number;
  games: number;
  type: Type;
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

export default model<IMaze>('Maze', mazeSchema);
