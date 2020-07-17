import { Schema, Document, Types, model } from 'mongoose';
import { IUser } from '../User';
import { IMember } from './subdocs/MemberSchema';
import { IMaze } from '../Maze';
import { values } from '../../utils/enum';

export interface IRoom extends Document {
  title: string;
  description: string;
  owner: IUser;
  type: Type;
  members: IMember[];
  maze: IMaze;
  requests: IUser[];
}

enum Type {
  PUBLIC,
  PRIVATE,
}

const roomSchema = new Schema({
  title: String,
  description: String,
  owner: { type: Types.ObjectId, ref: 'User', required: true },
  type: { type: Number, enum: values(Type), default: Type.PRIVATE },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  maze: { type: Types.ObjectId, ref: 'Maze' },
  requests: [{ type: Types.ObjectId, ref: 'User' }],
});

export default model<IRoom>('Room', roomSchema);
