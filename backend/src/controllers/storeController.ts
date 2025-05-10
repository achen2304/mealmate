import { Request, Response } from 'express';
import { MarketItem, MarketCreate, MarketUpdate } from '../types/marketType';
import { StoreModel } from '../models/storeModel';

export class StoreController {
  async getAllItems(req: Request, res: Response) {
    try {
      const items = await StoreModel.find();
      res.json(items);
    } catch (error) {
      console.error('Error fetching store items:', error);
      res.status(500).json({ message: 'Error fetching store items' });
    }
  }

  async getItemById(req: Request, res: Response) {
    try {
      const item = await StoreModel.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Store item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching store item:', error);
      res.status(500).json({ message: 'Error fetching store item' });
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const itemData: MarketCreate = req.body;

      const newItem = new StoreModel({
        ...itemData,
        description: Array.isArray(itemData.description)
          ? itemData.description
          : [itemData.description],
      });

      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      console.error('Error creating store item:', error);
      res.status(500).json({ message: 'Error creating store item' });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const itemData: MarketUpdate = req.body;
      const updateData: any = { ...itemData };

      if (itemData.description && !Array.isArray(itemData.description)) {
        updateData.description = [itemData.description];
      }

      updateData.updatedAt = new Date();

      const updatedItem = await StoreModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedItem) {
        return res.status(404).json({ message: 'Store item not found' });
      }
      res.json(updatedItem);
    } catch (error) {
      console.error('Error updating store item:', error);
      res.status(500).json({ message: 'Error updating store item' });
    }
  }

  async deleteItem(req: Request, res: Response) {
    try {
      const deleted = await StoreModel.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Store item not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting store item:', error);
      res.status(500).json({ message: 'Error deleting store item' });
    }
  }
}
