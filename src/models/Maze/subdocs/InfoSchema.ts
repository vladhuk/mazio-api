import { Schema } from 'mongoose';

export interface IInfo {
  knife: boolean;
  bullets: number;
  bulletsOnStart: number;
  granades: number;
  granadesOnStart: number;
  recommendedPlayers: number;
  stairs: number;
}

export default new Schema({
  knife: Boolean,
  bullets: { type: Number, min: 0 },
  bulletsOnStart: { type: Number, min: 0 },
  granades: { type: Number, min: 0 },
  granadesOnStart: { type: Number, min: 0 },
  recommendedPlayers: { type: Number, min: 2, default: 2 },
  stairs: { type: Number, min: 1, max: 100, default: 1 },
});
