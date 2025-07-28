import { getCart, addItem } from '../../controllers/cartController';
import * as cartService from '../../services/cartService';
import { AuthenticatedRequest } from '../../interface/userInterface';
import { Response } from 'express';

jest.mock('../../services/cartService');

describe('Cart Controller', () => {
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRes = {
      status: statusMock,
      json: jsonMock
    };
  });

  describe('getCart', () => {
    it('should return the user cart with status 200', async () => {
      const mockCart = { cartId: 1, items: [] };
      (cartService.getUserCart as jest.Mock).mockResolvedValue(mockCart);

      const mockReq = {
        user: { id: 123 }
      } as AuthenticatedRequest;

      await getCart(mockReq, mockRes as Response);

      expect(cartService.getUserCart).toHaveBeenCalledWith(123);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockCart);
    });

    it('should handle errors and return status 500', async () => {
      (cartService.getUserCart as jest.Mock).mockRejectedValue(new Error('DB error'));

      const mockReq = {
        user: { id: 123 }
      } as AuthenticatedRequest;

      await getCart(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('addItem', () => {
    it('should add item to cart and return 201', async () => {
      const mockItem = { cartItemId: 1, productId: 45, quantity: 2 };
      (cartService.addToCart as jest.Mock).mockResolvedValue(mockItem);

      const mockReq = {
        user: { id: 123 },
        body: { productId: 45, quantity: 2 }
      } as AuthenticatedRequest;

      await addItem(mockReq, mockRes as Response);

      expect(cartService.addToCart).toHaveBeenCalledWith(123, 45, 2);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockItem);
    });

    it('should handle errors and return status 400', async () => {
      (cartService.addToCart as jest.Mock).mockRejectedValue(new Error('Product not found'));

      const mockReq = {
        user: { id: 123 },
        body: { productId: 999, quantity: 1 }
      } as AuthenticatedRequest;

      await addItem(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
});
