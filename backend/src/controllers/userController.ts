import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { RecipeModel } from '../models/recipe';
import {
  UserRegister,
  UserLogin,
  UserUpdate,
  UserDelete,
} from '../types/usertype';

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userData: UserRegister = req.body;
    const user = await UserModel.create(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: UserLogin = req.body;
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UserUpdate = req.body;

    const user = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting user' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user' });
  }
};

export const getUserRecipes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const recipes = await RecipeModel.find({
      _id: { $in: user.recipesId },
    });

    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user recipes' });
  }
};

export const addRecipeToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { recipeId } = req.body;

    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $addToSet: { recipesId: recipeId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'Recipe added to user successfully', user });
  } catch (error) {
    res.status(400).json({ error: 'Error adding recipe to user' });
  }
};

export const removeRecipeFromUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { recipeId } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { recipesId: recipeId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'Recipe removed from user successfully', user });
  } catch (error) {
    res.status(400).json({ error: 'Error removing recipe from user' });
  }
};
