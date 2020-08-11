import { Schema } from 'mongoose';

export interface ILocation {
  x: number;
  y: number;
}

export default new Schema({
  x: { type: Number, min: 0, required: true },
  y: { type: Number, min: 0, required: true },
});
