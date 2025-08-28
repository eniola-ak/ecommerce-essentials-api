import { getCart, addItem, updateCartItem,deleteCartItem } from '../../controllers/cartController';
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

      expect(cartService.addToCart).toHaveBeenCalledWith(123, { productId: 45, quantity: 2 });
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
describe('updateCartItem', () => {
    it('should update cart item and return 200', async () => {
      const updatedItem = { itemId: 1, quantity: 3 };
      (cartService.updateCartItem as jest.Mock).mockResolvedValue(updatedItem);

      const mockReq = {
        user: { id: 123 },
        params: { itemId: '1' },
        body: { quantity: 3 }
      } as unknown as AuthenticatedRequest;

      await updateCartItem(mockReq, mockRes as Response);

      expect(cartService.updateCartItem).toHaveBeenCalledWith(123, 1, { quantity: 3 });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedItem);
    });

    it('should handle validation error and return 400', async () => {
      const mockReq = {
        user: { id: 123 },
        params: { itemId: '1' },
        body: { quantity: 0 }
      } as unknown as AuthenticatedRequest;

      await updateCartItem(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String)
      }));
    });

    it('should handle service error and return 400', async () => {
      (cartService.updateCartItem as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const mockReq = {
        user: { id: 123 },
        params: { itemId: '1' },
        body: { quantity: 2 }
      } as unknown as AuthenticatedRequest;

      await updateCartItem(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Update failed' });
    });
  });

  describe('deleteCartItem', () => {
    it('should delete cart item and return 204', async () => {
      (cartService.deleteCartItem as jest.Mock).mockResolvedValue(undefined);

      const mockReq = {
        user: { id: 123 },
        params: { itemId: '1' }
      } as unknown as AuthenticatedRequest;

      const sendMock = jest.fn();
      statusMock.mockReturnValueOnce({ send: sendMock } as any);

      await deleteCartItem(mockReq, mockRes as Response);

      expect(cartService.deleteCartItem).toHaveBeenCalledWith(123, 1);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it('should handle errors and return 400', async () => {
      (cartService.deleteCartItem as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const mockReq = {
        user: { id: 123 },
        params: { itemId: '1' }
      } as unknown as AuthenticatedRequest;

      await deleteCartItem(mockReq, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Delete failed' });
    });
  });
});


