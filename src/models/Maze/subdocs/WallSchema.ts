import Location, { ILocation } from './LocationSchema';
import { Schema } from 'mongoose';

export enum Type {
  STONE = 'STONE',
  RUBBER = 'RUBBER',
  TRANSLUCENT = 'TRANSLUCENT',
  OUTPUT = 'OUTPUT',
}

export interface IWall {
  location: ILocation;
  type: Type;
}

export default new Schema({
  location: { type: Location, required: true },
  type: { type: String, enum: Object.values(Type) },
});
