import { Document } from 'mongoose';

export interface MarketItem extends Document {
  name: string;
  type: string;
  description: string[];
  author: string;
  cost: number;
  recipesId?: string[];
  planType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketCreate {
  name: string;
  type: string;
  description: string | string[];
  author: string;
  cost: number;
  recipesId?: string[];
  planType?: string;
}

export interface MarketUpdate {
  name?: string;
  type?: string;
  description?: string | string[];
  author?: string;
  cost?: number;
  recipesId?: string[];
  planType?: string;
  updatedAt?: Date;
}

export interface MarketDelete {
  _id: string;
}
