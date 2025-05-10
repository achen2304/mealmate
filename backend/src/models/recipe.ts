import mongoose, { Document, Schema } from 'mongoose';
import { Recipe } from '../types/recipeType';

interface IRecipe extends Recipe, Document {}

const recipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
      {
        name: { type: String, required: false },
        amount: { type: String, required: false },
        unit: { type: String, required: false },
        type: { type: String, required: false },
      },
    ],
    steps: [
      {
        number: { type: Number, required: false },
        instruction: { type: String, required: false },
      },
    ],
    tags: [{ type: String, required: false }],
    author: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const RecipeModel = mongoose.model<IRecipe>('Recipe', recipeSchema);
