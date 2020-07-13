import { Schema } from 'mongoose';

export interface ISize {
  height: number;
  width: number;
}

export default new Schema({
  height: { type: Number, min: 1, max: 100 },
  width: { type: Number, min: 1, max: 100 },
});
