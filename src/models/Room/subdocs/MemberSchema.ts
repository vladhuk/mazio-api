import { Schema } from 'mongoose';
import { IUser } from '../../User';
import { names } from '../../../utils/enum';

export interface IMember {
  user: IUser;
  role: Role;
}

enum Role {
  WATCHER,
  PARTICIPANT,
  DEPUTY,
}

export default new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: names(Role), default: Role.PARTICIPANT },
});
