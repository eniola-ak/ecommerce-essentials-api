import { Request, Response } from 'express';
import * as cartService from '../services/cartService';
import { AuthenticatedRequest } from '../interface/userInterface';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getUserCart(userId);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const item = await cartService.addToCart(userId, productId, quantity);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
