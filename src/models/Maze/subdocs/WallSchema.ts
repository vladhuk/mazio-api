import Location, { ILocation } from './LocationSchema';
import { names } from '../../../utils/enum';
import { Schema } from 'mongoose';

enum Direction {
  TOP,
  BOTTOM,
  RIGHT,
  LEFT,
}

enum Type {
  DEFAULT,
  RUBBER,
  TRANSLUCENT,
  OUTPUT,
}

export interface IWall {
  location: ILocation;
  direction: Direction;
  type: Type;
}

export default new Schema({
  location: { type: Location, required: true },
  direction: { type: String, enum: names(Direction) },
  type: { type: String, enum: names(Type) },
});
