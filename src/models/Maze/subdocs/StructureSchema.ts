import { Schema } from 'mongoose';
import SizeSchema, { ISize } from './SizeSchema';
import LocationSchema, { ILocation } from './LocationSchema';
import PitSchema, { IPit } from './PitSchema';
import RiverSchema, { IRiver } from './RiverSchema';

export interface IStructure {
  size: ISize;
  walls: ILocation[];
  rubberWalls: ILocation[];
  translucentWalls: ILocation[];
  outputs: ILocation[];
  pits: IPit[];
  arsenals: ILocation[];
  treasure: ILocation;
  fakeTreasures: ILocation[];
  spawns: ILocation[];
  rivers: IRiver[];
  traps: ILocation[];
  ladders: ILocation[];
}

export default new Schema({
  size: SizeSchema,
  walls: [LocationSchema],
  rubberWalls: [LocationSchema],
  translucentWalls: [LocationSchema],
  outputs: [LocationSchema],
  pits: [PitSchema],
  arsenals: [LocationSchema],
  treasure: LocationSchema,
  fakeTreasures: [LocationSchema],
  spawns: [LocationSchema],
  rivers: [RiverSchema],
  traps: [LocationSchema],
  ladders: [LocationSchema],
});
