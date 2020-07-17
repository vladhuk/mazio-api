import { Schema } from 'mongoose';

export interface IInfo {
  knife: boolean;
  bullets: number;
  bulletsOnStart: number;
  granades: number;
  granadesOnStart: number;
  recommendedPlayers?: number;
  stairs: number;
}

export default new Schema({
  knife: { type: Boolean, default: true },
  bullets: { type: Number, min: 0, required: true },
  bulletsOnStart: { type: Number, min: 0, required: true },
  granades: { type: Number, min: 0, required: true },
  granadesOnStart: { type: Number, min: 0, required: true },
  recommendedPlayers: { type: Number, min: 2, default: 2 },
  stairs: { type: Number, min: 1, max: 100, default: 1 },
});
