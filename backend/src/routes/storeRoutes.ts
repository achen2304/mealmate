import { Router, Request, Response } from 'express';
import { StoreController } from '../controllers/storeController';

const router = Router();
const storeController = new StoreController();

router.get('/', async (req: Request, res: Response) => {
  await storeController.getAllItems(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await storeController.getItemById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await storeController.createItem(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await storeController.updateItem(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await storeController.deleteItem(req, res);
});

export default router;
