import { Request, Response } from 'express';
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProductBySlug,
  deleteProductBySlug
} from '../../controllers/productController';
import * as productService from '../../services/productService';

jest.mock('../../services/productService');

describe('Product Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    req = {};
    res = { status, json } as unknown as Response;
    jest.clearAllMocks();
  });

  // CREATE
  describe('createProduct', () => {
    it('should return 400 on validation error', async () => {
      req.body = {};
      (productService.createNewProduct as jest.Mock).mockRejectedValueOnce(
        new Error('Missing required fields')
      );

      await createProduct(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should return 201 and created product', async () => {
      const newProduct = { title: 'Phone', slug: 'phone', price: 200, stockQuantity: 10, categoryId: 1 };
      req.body = newProduct;
      (productService.createNewProduct as jest.Mock).mockResolvedValueOnce(newProduct);

      await createProduct(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(newProduct);
    });
  });

  // READ ALL
  describe('getProducts', () => {
    it('should return product list and count', async () => {
      const mockResult = { count: 2, products: [{ title: 'A' }, { title: 'B' }] };
      (productService.getProducts as jest.Mock).mockResolvedValueOnce(mockResult);

      await getProducts(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 500 on service error', async () => {
      (productService.getProducts as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      await getProducts(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Failed to fetch products' });
    });
  });

  // READ ONE
  describe('getProductBySlug', () => {
    it('should return 404 if product not found', async () => {
      req.params = { slug: 'missing' };
      (productService.getProductBySlug as jest.Mock).mockResolvedValueOnce(null);

      await getProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should return 200 with product data', async () => {
      const product = { title: 'Book', slug: 'book' };
      req.params = { slug: 'book' };
      (productService.getProductBySlug as jest.Mock).mockResolvedValueOnce(product);

      await getProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(product);
    });

    it('should return 500 on internal error', async () => {
      req.params = { slug: 'error' };
      (productService.getProductBySlug as jest.Mock).mockRejectedValueOnce(new Error('Internal error'));

      await getProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // UPDATE
  describe('updateProductBySlug', () => {
    it('should return 404 if product is not found', async () => {
      req.params = { slug: 'missing' };
      req.body = { title: 'Updated' };
      (productService.updateProductBySlug as jest.Mock).mockRejectedValueOnce(
        new Error('Product not found.')
      );

      await updateProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Product not found.' });
    });

    it('should return 409 if new slug already exists', async () => {
      req.params = { slug: 'old' };
      req.body = { slug: 'existing' };
      (productService.updateProductBySlug as jest.Mock).mockRejectedValueOnce(
        new Error('Another product with this slug already exists.')
      );

      await updateProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith({ message: 'Another product with this slug already exists.' });
    });

    it('should return 200 on successful update', async () => {
      req.params = { slug: 'product' };
      req.body = { title: 'New Title' };
      const updated = { title: 'New Title', slug: 'product' };

      (productService.updateProductBySlug as jest.Mock).mockResolvedValueOnce(updated);

      await updateProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({
        message: 'Product updated successfully',
        product: updated,
      });
    });
  });

  // DELETE
  describe('deleteProductBySlug', () => {
    it('should return 404 if product not found', async () => {
      req.params = { slug: 'not-found' };
      (productService.deleteProductBySlug as jest.Mock).mockRejectedValueOnce(
        new Error('Product not found.')
      );

      await deleteProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Product not found.' });
    });

    it('should delete product and return 200', async () => {
      req.params = { slug: 'phone' };
      (productService.deleteProductBySlug as jest.Mock).mockResolvedValueOnce(true);

      await deleteProductBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
    });
  });
});
