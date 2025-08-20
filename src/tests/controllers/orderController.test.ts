import { Response } from 'express';
import { AuthenticatedRequest } from '../../interface/userInterface';
import * as orderController from '../../controllers/orderController';
import * as orderService from '../../services/orderService';

jest.mock('../../services/orderService');

describe('Order Controller', () => {
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

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
    it('should create an order successfully', async () => {
      const mockOrder = { id: 1, totalAmount: 100 };
      (orderService.createOrderFromCart as jest.Mock).mockResolvedValue(mockOrder);

      const mockReq = { user: { id: 2 } } as unknown as AuthenticatedRequest;

      await orderController.createOrder(mockReq, mockRes as Response);

      expect(orderService.createOrderFromCart).toHaveBeenCalledWith(2);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 400 if service throws error', async () => {
      (orderService.createOrderFromCart as jest.Mock).mockRejectedValue(new Error('Cart empty'));
      const mockReq = { user: { id: 2 } } as unknown as AuthenticatedRequest;

      await orderController.createOrder(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Cart empty' });
    });
  });

  describe('getOrder', () => {
    it('should return an order successfully', async () => {
      const mockOrder = { orderNumber: 'ORDER-1' };
      (orderService.getOrderByNumber as jest.Mock).mockResolvedValue(mockOrder);

      const mockReq = { params: { orderNumber: 'ORDER-1' }, user: { id: 2, role: 'user' } } as unknown as AuthenticatedRequest;

      await orderController.getOrder(mockReq, mockRes as Response);

      expect(orderService.getOrderByNumber).toHaveBeenCalledWith('ORDER-1', 2, false);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 403 for unauthorized access', async () => {
      (orderService.getOrderByNumber as jest.Mock).mockRejectedValue(new Error('Unauthorized access'));
      const mockReq = { params: { orderNumber: 'ORDER-1' }, user: { id: 2, role: 'user' } } as unknown as AuthenticatedRequest;

      await orderController.getOrder(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized access' });
    });

    it('should return 404 if order not found', async () => {
      (orderService.getOrderByNumber as jest.Mock).mockRejectedValue(new Error('Order not found'));
      const mockReq = { params: { orderNumber: 'ORDER-1' }, user: { id: 2, role: 'user' } } as unknown as AuthenticatedRequest;

      await orderController.getOrder(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Order not found' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const updatedOrder = { id: 1, orderStatus: 'SHIPPED' };
      (orderService.changeOrderStatus as jest.Mock).mockResolvedValue(updatedOrder);

      const mockReq = { params: { orderNumber: 'ORDER-1' }, body: { orderStatus: 'SHIPPED' } } as unknown as AuthenticatedRequest;

      await orderController.updateOrderStatus(mockReq, mockRes as Response);

      expect(orderService.changeOrderStatus).toHaveBeenCalledWith('ORDER-1', 'SHIPPED');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ success: true, data: updatedOrder });
    });

    it('should return 400 if orderStatus is missing', async () => {
      const mockReq = { params: { orderNumber: 'ORDER-1' }, body: {} } as unknown as AuthenticatedRequest;

      await orderController.updateOrderStatus(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'orderStatus is required' });
    });

    it('should return 400 for invalid orderStatus', async () => {
      const mockReq = { params: { orderNumber: 'ORDER-1' }, body: { orderStatus: 'INVALID' } } as unknown as AuthenticatedRequest;

      await orderController.updateOrderStatus(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Invalid orderStatus' });
    });

    it('should return 404 if order not found', async () => {
      (orderService.changeOrderStatus as jest.Mock).mockRejectedValue(new Error('Order not found'));
      const mockReq = { params: { orderNumber: 'ORDER-1' }, body: { orderStatus: 'SHIPPED' } } as unknown as AuthenticatedRequest;

      await orderController.updateOrderStatus(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ success: false, message: 'Order not found' });
    });
  });
});
