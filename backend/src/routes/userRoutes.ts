import express from 'express';
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
} from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/:id', getUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
