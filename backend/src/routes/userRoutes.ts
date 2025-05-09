import express from 'express';
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  getUserRecipes,
  addRecipeToUser,
  removeRecipeFromUser,
} from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/:id', getUser);

router.get('/:id/recipes', getUserRecipes);

router.post('/:id/recipes', addRecipeToUser);

router.delete('/:id/recipes', removeRecipeFromUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
