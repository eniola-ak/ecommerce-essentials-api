import { Request, Response } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug
} from '../../controllers/categoryController';
import * as categoryService from '../../services/categoryService';

// Mock the entire service layer
jest.mock('../../services/categoryService');

describe('Category Controller', () => {
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

  describe('createCategory', () => {
    it('should return 400 if name or slug is missing', async () => {
      req.body = { description: 'Missing name and slug' };

      await createCategory(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledWith({ message: 'Name and slug are required.' });
    });

    it('should return 409 if category with slug already exists', async () => {
      req.body = { name: 'Books', slug: 'books' };
      (categoryService.createNewCategory as jest.Mock).mockRejectedValueOnce(
        new Error('Category with this slug already exists.')
      );

      await createCategory(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith({ message: 'Category with this slug already exists.' });
    });

    it('should create category and return 201', async () => {
      const data = { name: 'Books', slug: 'books', description: 'All books' };
      req.body = data;

      (categoryService.createNewCategory as jest.Mock).mockResolvedValueOnce(data);

      await createCategory(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(data);
    });
  });

  describe('getAllCategories', () => {
    it('should return categories', async () => {
      const mockCategories = [{ name: 'Books', slug: 'books' }];
      (categoryService.getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

      await getAllCategories(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(mockCategories);
    });

    it('should return 500 on error', async () => {
      (categoryService.getCategories as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      await getAllCategories(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return 404 if category is not found', async () => {
      req.params = { slug: 'not-found' };
      (categoryService.getCategory as jest.Mock).mockResolvedValueOnce(null);

      await getCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Category not found.' });
    });

    it('should return category if found', async () => {
      const category = { name: 'Books', slug: 'books' };
      req.params = { slug: 'books' };
      (categoryService.getCategory as jest.Mock).mockResolvedValueOnce(category);

      await getCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(category);
    });

    it('should return 500 on error', async () => {
      req.params = { slug: 'error' };
      (categoryService.getCategory as jest.Mock).mockRejectedValueOnce(new Error('Some DB error'));

      await getCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({ message: 'Internal server error.' });
    });
  });

  describe('updateCategoryBySlug', () => {
    it('should return 404 if category is not found', async () => {
      req.params = { slug: 'not-found' };
      req.body = { name: 'New name' };
      (categoryService.updateCategoryBySlug as jest.Mock).mockRejectedValueOnce(
        new Error('Category not found.')
      );

      await updateCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Category not found.' });
    });

    it('should return 409 if newSlug already exists', async () => {
      req.params = { slug: 'old-slug' };
      req.body = { newSlug: 'existing-slug' };
      (categoryService.updateCategoryBySlug as jest.Mock).mockRejectedValueOnce(
        new Error('Another category with the new slug already exists.')
      );

      await updateCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith({ message: 'Another category with the new slug already exists.' });
    });

    it('should update category and return 200', async () => {
      req.params = { slug: 'books' };
      req.body = { name: 'Updated Books' };
      const updatedCategory = { name: 'Updated Books', slug: 'books' };

      (categoryService.updateCategoryBySlug as jest.Mock).mockResolvedValueOnce(updatedCategory);

      await updateCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(updatedCategory);
    });
  });

  describe('deleteCategoryBySlug', () => {
    it('should return 404 if category not found', async () => {
      req.params = { slug: 'not-found' };
      (categoryService.deleteCategoryBySlug as jest.Mock).mockRejectedValueOnce(
        new Error('Category not found.')
      );

      await deleteCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Category not found.' });
    });

    it('should delete category and return 200', async () => {
      req.params = { slug: 'books' };
      (categoryService.deleteCategoryBySlug as jest.Mock).mockResolvedValueOnce(true);

      await deleteCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith({ message: 'Category deleted successfully.' });
    });
  });
});