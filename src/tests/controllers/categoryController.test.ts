import { Request, Response } from 'express';
import { createCategory, getAllCategories, getCategoryBySlug } from '../../controllers/categoryController';
import { Category } from '../../models/category';

jest.mock('../../models/category'); // 👈 Mock Sequelize model

const mockedCategory = Category as jest.Mocked<typeof Category>;

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
      req.body = { name: 'Books', slug: 'books', description: 'All kinds of books' };
      mockedCategory.findOne.mockResolvedValueOnce({} as Category);

      await createCategory(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(409);
      expect(json).toHaveBeenCalledWith({ message: 'Category with this slug already exists.' });
    });

    it('should create category and return 201', async () => {
      req.body = { name: 'Books', slug: 'books', description: 'All kinds of books' };
      mockedCategory.findOne.mockResolvedValueOnce(null);
      mockedCategory.create.mockResolvedValueOnce(req.body as Category);

      await createCategory(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(201);
      expect(json).toHaveBeenCalledWith(req.body);
    });
  });

  describe('getAllCategories', () => {
    it('should return categories', async () => {
      const mockData = [{ name: 'Books', slug: 'books' }];
      mockedCategory.findAll.mockResolvedValueOnce(mockData as Category[]);

      await getAllCategories(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(mockData);
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return 404 if category is not found', async () => {
      req.params = { slug: 'unknown' };
      mockedCategory.findOne.mockResolvedValueOnce(null);

      await getCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({ message: 'Category not found.' });
    });

    it('should return category if found', async () => {
      const found = { name: 'Books', slug: 'books' };
      req.params = { slug: 'books' };
      mockedCategory.findOne.mockResolvedValueOnce(found as Category);

      await getCategoryBySlug(req as Request, res as Response);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith(found);
    });
  });
});