import express from 'express';
import {
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
} from '../controllers/recipeController';

const router = express.Router();

router.get('/', getAllRecipes);

router.get('/:id', getRecipe);

router.post('/', createRecipe);

router.put('/:id', updateRecipe);

router.delete('/:id', deleteRecipe);

export default router;
