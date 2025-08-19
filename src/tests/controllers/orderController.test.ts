import { Response } from 'express';
import { createOrder, getOrder, getAdminOrders, updateOrderStatus } from '../../controllers/orderController';
import * as orderService from '../../services/orderService';
import { AuthenticatedRequest } from '../../interface/userInterface';

jest.mock('../../services/orderService');

describe('Order Controller', () => {
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order from cart', async () => {
      const mockOrder = { id: 1, orderNumber: 'ORD123' };
      (orderService.createOrderFromCart as jest.Mock).mockResolvedValue(mockOrder);

      const mockReq = { user: { id: 1 } } as AuthenticatedRequest;

      await createOrder(mockReq, mockRes as Response);

      expect(orderService.createOrderFromCart).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle errors when creating an order', async () => {
      (orderService.createOrderFromCart as jest.Mock).mockRejectedValue(new Error('Cart is empty'));

      const mockReq = { user: { id: 1 } } as AuthenticatedRequest;

      await createOrder(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Cart is empty' });
    });
  });

  // -------------------------
  // GET /api/orders/:orderNumber
  // -------------------------
  describe('getOrder', () => {
    it('should return an order if authorized', async () => {
      const mockOrder = { orderNumber: 'ORD123', userId: 1 };
      (orderService.getOrderByNumber as jest.Mock).mockResolvedValue(mockOrder);

      const mockReq = {
        params: { orderNumber: 'ORD123' },
        user: { id: 1, role: 'customer' },
      } as unknown as AuthenticatedRequest;

      await getOrder(mockReq, mockRes as Response);

      expect(orderService.getOrderByNumber).toHaveBeenCalledWith('ORD123', 1, false);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 403 if unauthorized', async () => {
      (orderService.getOrderByNumber as jest.Mock).mockRejectedValue(new Error('Unauthorized access'));

      const mockReq = {
        params: { orderNumber: 'ORD999' },
        user: { id: 2, role: 'customer' },
      } as unknown as AuthenticatedRequest;

      await getOrder(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized access' });
    });

    it('should return 404 if order not found', async () => {
      (orderService.getOrderByNumber as jest.Mock).mockRejectedValue(new Error('Order not found'));

      const mockReq = {
        params: { orderNumber: 'ORD999' },
        user: { id: 1, role: 'admin' },
      } as unknown as AuthenticatedRequest;

      await getOrder(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Order not found' });
    });
  });

  // -------------------------
  // GET /api/admin/orders
  // -------------------------
  describe('getAllOrders', () => {
    it('should return all orders for admin', async () => {
      (orderService.getAllOrders as jest.Mock).mockResolvedValue({
        count: 2,
        orders: [{ id: 1 }, { id: 2 }],
      });

      const mockReq = { query: {} } as unknown as AuthenticatedRequest;

      await getAdminOrders(mockReq, mockRes as Response);

      expect(orderService.getAllOrders).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        count: 2,
        orders: [{ id: 1 }, { id: 2 }],
      });
    });

    it('should handle errors when fetching orders', async () => {
      (orderService.getAllOrders as jest.Mock).mockRejectedValue(new Error('DB error'));

      const mockReq = { query: {} } as unknown as AuthenticatedRequest;

      await getAdminOrders(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'Failed to fetch orders' }));
    });
  });

  // -------------------------
  // PUT /api/admin/orders/:orderNumber/status
  // -------------------------
  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const mockOrder = { id: 1, status: 'PROCESSING' };
      (orderService.changeOrderStatus as jest.Mock).mockResolvedValue(mockOrder);

      const mockReq = {
        params: { orderNumber: 'ORD123' },
        body: { orderStatus: 'PROCESSING' },
      } as unknown as AuthenticatedRequest;

      await updateOrderStatus(mockReq, mockRes as Response);

      expect(orderService.changeOrderStatus).toHaveBeenCalledWith('ORD123', 'PROCESSING');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 400 if orderStatus is missing', async () => {
      const mockReq = {
        params: { orderNumber: 'ORD123' },
        body: {},
      } as unknown as AuthenticatedRequest;

      await updateOrderStatus(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'orderStatus is required' });
    });

    it('should handle errors when updating status', async () => {
      (orderService.changeOrderStatus as jest.Mock).mockRejectedValue(new Error('Order not found'));

      const mockReq = {
        params: { orderNumber: 'ORD999' },
        body: { orderStatus: 'CANCELLED' },
      } as unknown as AuthenticatedRequest;

      await updateOrderStatus(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Order not found' });
    });
  });
});
