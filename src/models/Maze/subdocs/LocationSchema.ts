import { Schema } from 'mongoose';
import { values } from '../../../utils/enum';

export interface ILocation {
  x: number;
  y: number;
  direction: Direction;
}

enum Direction {
  TOP,
  BOTTOM,
  RIGHT,
  LEFT,
}

export default new Schema({
  x: { type: Number, min: 0, required: true },
  y: { type: Number, min: 0, required: true },
  direction: { type: Number, enum: values(Direction) },
});
