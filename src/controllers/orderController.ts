import { Response } from 'express';
import { AuthenticatedRequest } from '../interface/userInterface';
import * as orderService from '../services/orderService';
import { PaginatedOrders } from '../interface/orderInterface';


export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const order = await orderService.createOrderFromCart(userId);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrder = async (req: AuthenticatedRequest, res: Response) :Promise<void>=>{
  try {
    const { orderNumber } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const order = await orderService.getOrderByNumber(orderNumber, userId, isAdmin);
    res.status(200).json(order);
  } catch (error: any) {
    if (error.message === 'Unauthorized access') {
      res.status(403).json({ message: error.message });
    } else if (error.message === 'Order not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getAdminOrders = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    const { orderStatus, page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const result:PaginatedOrders = await orderService.getAllOrders(
      orderStatus as string | undefined,
      pageNum,
      limitNum
    );

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: {
        total: result.totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { orderNumber } = req.params;
    const { orderStatus } = req.body;

    const updatedOrder = await orderService.changeOrderStatus(
      orderNumber,
      orderStatus
    );

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error: any) {

    if (error.message === 'orderStatus is required' || error.message === 'Invalid orderStatus') {
      res.status(400).json({ success: false, message: error.message });
    } else if (error.message === 'Order not found') {
      res.status(404).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Failed to update order status' });
    }
  }
};