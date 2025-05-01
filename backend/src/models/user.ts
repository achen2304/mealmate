import mongoose, { Document, Schema } from 'mongoose';
import { User } from '../types/usertype';

interface IUser extends User, Document {}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    recipesId: [{ type: String }],
    cartId: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
