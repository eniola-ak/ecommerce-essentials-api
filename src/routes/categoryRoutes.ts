import { Router, Request, Response, NextFunction } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug
} from '../controllers/categoryController';

const router = Router();

const adminOnlyStub = (_req: Request, res: Response, next: NextFunction) => {
  const isAdmin = true;
  if (!isAdmin) {
    res.status(403).json({ message: 'Forbidden. Admins only.' });
    return;
  }
  next();
};

// POST /api/categories - Create a category
router.post('/', adminOnlyStub, createCategory);

// GET /api/categories - Show all categories
router.get('/', getAllCategories);

// GET /api/categories/:slug - Show a category using slug
router.get('/:slug', getCategoryBySlug);

export default router;