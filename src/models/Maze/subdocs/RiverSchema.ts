import { Schema } from 'mongoose';
import LocationSchema, { ILocation } from './LocationSchema';

export interface IRiver {
  start: ILocation;
  end: ILocation;
  cells: ILocation[];
}

export default new Schema({
  start: { type: LocationSchema, required: true },
  end: { type: LocationSchema, required: true },
  cells: [LocationSchema],
});
