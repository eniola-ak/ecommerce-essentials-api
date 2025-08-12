import { Response } from 'express';
import { AuthenticatedRequest } from '../interface/userInterface';
import * as orderService from '../services/orderService';

// POST /api/orders - Create order from cart (Customer only)
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const order = await orderService.createOrderFromCart(userId);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/orders/:orderNumber - Get order by order number
export const getOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const order = await orderService.getOrderByNumber(orderNumber, userId, isAdmin);
    res.status(200).json(order);
  } catch (error: any) {
    // 403 for unauthorized, 404 for not found, 400 for other errors
    if (error.message === 'Unauthorized access') {
      res.status(403).json({ message: error.message });
    } else if (error.message === 'Order not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};