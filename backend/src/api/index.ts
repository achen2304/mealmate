import { Router } from 'express';
import userRoutes from '../routes/userRoutes';
import recipeRoutes from '../routes/recipeRoutes';
import storeRoutes from '../routes/storeRoutes';

const router = Router();

const API_PREFIX = '/api';

router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/recipes`, recipeRoutes);
router.use(`${API_PREFIX}/store`, storeRoutes);

router.get(`${API_PREFIX}/health`, (req, res) => {
  res.json({ status: 'ok', version: 'v1' });
});

export default router;
