import { Response } from 'express';
import * as cartService from '../services/cartService';
import { AuthenticatedRequest } from '../interface/userInterface';
import { updateCartItemSchema } from '../validations/cartValidation';

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
    const item = await cartService.addToCart(userId, {productId, quantity});
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const itemId = Number(req.params.itemId);
    const userId = req.user.id;

    const parsed = updateCartItemSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0].message });
      return;
    }

    const updatedItem = await cartService.updateCartItem(userId, itemId, parsed.data);
    res.status(200).json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCartItem = async (req: AuthenticatedRequest, res: Response) => {
  const itemId = Number(req.params.itemId);
  const userId = req.user.id;

  try {
    await cartService.deleteCartItem(userId, itemId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
