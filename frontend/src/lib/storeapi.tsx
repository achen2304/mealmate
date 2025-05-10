import axios from 'axios';

// API calls for store/market

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface StoreItem {
  _id: string;
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

export const storeApi = {
  getAllItems: async (): Promise<StoreItem[]> => {
    const response = await axios.get(`${API_URL}/store`);
    return response.data;
  },

  getItemById: async (id: string): Promise<StoreItem> => {
    const response = await axios.get(`${API_URL}/store/${id}`);
    return response.data;
  },

  createItem: async (
    item: Omit<StoreItem, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<StoreItem> => {
    const response = await axios.post(`${API_URL}/store`, item);
    return response.data;
  },

  updateItem: async (
    id: string,
    item: Partial<StoreItem>
  ): Promise<StoreItem> => {
    const response = await axios.put(`${API_URL}/store/${id}`, item);
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/store/${id}`);
  },
};
