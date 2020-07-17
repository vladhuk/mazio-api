import { Schema, Types } from 'mongoose';
import { IUser } from '../../User';
import { values } from '../../../utils/enum';

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
  user: { type: Types.ObjectId, ref: 'User', required: true },
  role: { type: Number, enum: values(Role), default: Role.PARTICIPANT },
});
