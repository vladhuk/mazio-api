import { Schema, Document, model } from 'mongoose';
import { IUser } from '../User';
import { IMember } from './subdocs/MemberSchema';
import { IMaze } from '../Maze';
import { names } from '../../utils/enum';

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
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: names(Type), default: Type.PRIVATE },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  maze: { type: Schema.Types.ObjectId, ref: 'Maze' },
  requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default model<IRoom>('Room', roomSchema);
