export interface MarketItem {
  id: string;
  name: string;
  type: string;
  planType?: string;
  description: string[];
  author: string;
  cost: number;
  recipesId?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketCreate {
  name: string;
  description: string;
  cost: number;
  recipesId?: string[];
}

export interface MarketUpdate {
  name?: string;
  description?: string;
  cost?: number;
  recipesId?: string[];
}

export interface MarketDelete {
  id: string;
}
