import { MarketItem, MarketCreate, MarketUpdate } from '../types/marketType';
import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: [String], required: true },
  author: { type: String, required: true },
  cost: { type: Number, required: true },
  recipesId: { type: [String] },
  planType: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const StoreModel = mongoose.model<MarketItem>('Store', storeSchema);
