import { Schema } from 'mongoose';
import { IUser } from '../../User';

export interface IMember {
  user: IUser;
  role: Role;
}

enum Role {
  WATCHER = 'WATCHER',
  PARTICIPANT = 'PARTICIPANT',
  DEPUTY = 'DEPUTY',
}

export default new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: Object.values(Role), default: Role.PARTICIPANT },
});
