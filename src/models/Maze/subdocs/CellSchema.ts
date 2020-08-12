import Location, { ILocation } from './LocationSchema';
import { Schema } from 'mongoose';

enum Type {
  ARSENAL = 'ARSENAL',
  HOSPITAL = 'HOSPITAL',
  TREASURE = 'TREASURE',
  FAKE_TREASURE = 'FAKE_TREASURE',
  SPAWN = 'SPAWN',
  RIVER = 'RIVER',
  RIVER_START = 'RIVER_START',
  RIVER_END = 'RIVER_END',
  TRAP = 'TRAP',
  PIT_IN = 'PIT_IN',
  PIT_OUT = 'PIT_OUT',
}

export interface ICell {
  location: ILocation;
  ref?: ILocation;
  type: Type;
}

export default new Schema({
  location: { type: Location, required: true },
  ref: Location,
  type: { type: String, enum: Object.values(Type) },
});
