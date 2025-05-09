import { Request, Response } from 'express';
import { RecipeModel } from '../models/recipe';
import { RecipeCreate, RecipeUpdate, RecipeDelete } from '../types/recipeType';
import { UserModel } from '../models/user';

//for merge request

export const createRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recipeData: RecipeCreate = req.body;
    const recipe = await RecipeModel.create({
      ...recipeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (recipe.author) {
      await UserModel.findByIdAndUpdate(recipe.author, {
        $addToSet: { recipesId: recipe._id },
      });
    }

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: 'Error creating recipe' });
  }
};

export const getRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findById(id);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching recipe' });
  }
};

export const updateRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: RecipeUpdate = req.body;

    const recipe = await RecipeModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: 'Error updating recipe' });
  }
};

export const deleteRecipe = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const recipe = await RecipeModel.findByIdAndDelete(id);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting recipe' });
  }
};

export const getAllRecipes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recipes = await RecipeModel.find();
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching recipes' });
  }
};
