import { Schema } from 'mongoose';
import SizeSchema, { ISize } from './SizeSchema';
import WallSchema, { IWall } from './WallSchema';
import CellSchema, { ICell } from './CellSchema';

export interface IStructure {
  size: ISize;
  walls: IWall[];
  cells: ICell[];
}

export default new Schema({
  size: { type: SizeSchema, required: true },
  walls: [{ type: WallSchema, required: true }],
  cells: [{ type: CellSchema, required: true }],
});
