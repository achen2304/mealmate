import axios from 'axios';

// API calls for recipes

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
    type: string;
  }[];
  steps: {
    number: number;
    instruction: string;
  }[];
  tags: string[];
  imageUrl?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export const recipeApi = {
  getAllRecipes: async (): Promise<Recipe[]> => {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  },

  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (
    recipeData: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Recipe> => {
    const response = await axios.post(`${API_URL}/recipes`, recipeData);
    return response.data;
  },

  updateRecipe: async (
    id: string,
    recipeData: Partial<Recipe>
  ): Promise<Recipe> => {
    const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/recipes/${id}`);
  },

  getUserRecipes: async (userId: string): Promise<Recipe[]> => {
    const response = await axios.get(`${API_URL}/users/${userId}/recipes`);
    return response.data;
  },

  addRecipeToUser: async (userId: string, recipeId: string): Promise<void> => {
    await axios.post(`${API_URL}/users/${userId}/recipes`, { recipeId });
  },

  removeRecipeFromUser: async (
    userId: string,
    recipeId: string
  ): Promise<void> => {
    await axios.delete(`${API_URL}/users/${userId}/recipes`, {
      data: { recipeId },
    });
  },
};
