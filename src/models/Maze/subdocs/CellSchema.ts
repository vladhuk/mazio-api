import Location, { ILocation } from './LocationSchema';
import { names } from '../../../utils/enum';
import { Schema } from 'mongoose';

enum Type {
  ARSENAL,
  HOSPITAL,
  TREASURE,
  FAKE_TREASURE,
  SPAWN,
  RIVER,
  RIVER_START,
  RIVER_END,
  TRAP,
  PIT_IN,
  PIT_OUT,
}

export interface ICell {
  location: ILocation;
  ref?: ILocation;
  type: Type;
}

export default new Schema({
  location: { type: Location, required: true },
  ref: Location,
  type: { type: String, enum: names(Type) },
});
