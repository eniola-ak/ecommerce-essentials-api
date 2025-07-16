import { Router, Request, Response, NextFunction } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug,
} from '../controllers/categoryController';
import { adminOnly } from '../middleware/adminOnly';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../validations/categoryValidation';
const router = Router();


// POST /api/categories - Create a category
router.post('/', adminOnly, validate(createCategorySchema), createCategory);

// GET /api/categories - Show all categories
router.get('/', getAllCategories);

// GET /api/categories/:slug - Show a category using slug
router.get('/:slug', getCategoryBySlug);

//PUT api/categories/:slug
router.patch('/:slug', adminOnly, validate(updateCategorySchema), updateCategoryBySlug);

//DELETE /api/categories/:slug
router.delete('/:slug', adminOnly, deleteCategoryBySlug);

export default router;