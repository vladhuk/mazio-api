import { Schema } from 'mongoose';
import LocationSchema, { ILocation } from './LocationSchema';

export interface IPit {
  in: ILocation;
  out: ILocation;
}

export default new Schema({
  in: { type: LocationSchema, required: true },
  out: { type: LocationSchema, required: true },
});
