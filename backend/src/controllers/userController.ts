import { Request, Response } from 'express';
import { UserModel } from '../models/user';
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
