import { Router, Request, Response, NextFunction } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug,
} from '../controllers/categoryController';
import { adminOnly } from '../middleware/adminOnly';
const router = Router();


// POST /api/categories - Create a category
router.post('/', adminOnly, createCategory);

// GET /api/categories - Show all categories
router.get('/', getAllCategories);

// GET /api/categories/:slug - Show a category using slug
router.get('/:slug', getCategoryBySlug);

//PUT api/categories/:slug
router.put('/:slug', adminOnly, updateCategoryBySlug);

//DELETE /api/categories/:slug
router.delete('/:slug', adminOnly, deleteCategoryBySlug);

export default router;