import { Schema } from 'mongoose';
import LocationSchema, { ILocation } from './LocationSchema';

export interface IRiver {
  start: ILocation;
  end: ILocation;
  cells: ILocation[];
}

export default new Schema({
  start: LocationSchema,
  end: LocationSchema,
  cells: [LocationSchema],
});
