import { Schema } from 'mongoose';
import LocationSchema, { ILocation } from './LocationSchema';

export interface IPit {
  in: ILocation;
  out: ILocation;
}

export default new Schema({
  in: LocationSchema,
  out: LocationSchema,
});
