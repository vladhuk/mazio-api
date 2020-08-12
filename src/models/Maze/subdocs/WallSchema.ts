import Location, { ILocation } from './LocationSchema';
import { Schema } from 'mongoose';

enum Direction {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

enum Type {
  DEFAULT = 'DEFAULT',
  RUBBER = 'RUBBER',
  TRANSLUCENT = 'TRANSLUCENT',
  OUTPUT = 'OUTPUT',
}

export interface IWall {
  location: ILocation;
  direction: Direction;
  type: Type;
}

export default new Schema({
  location: { type: Location, required: true },
  direction: { type: String, enum: Object.values(Direction) },
  type: { type: String, enum: Object.values(Type) },
});
