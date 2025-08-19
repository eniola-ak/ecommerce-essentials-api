import { Router, Request, Response, NextFunction } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategoryBySlug,
  deleteCategoryBySlug,
} from '../controllers/categoryController';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../validations/categoryValidation';
import { adminOnly } from '../middleware/authMiddleware'; 
const router = Router();

router.post('/',adminOnly, validate(createCategorySchema), createCategory);
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.patch('/:slug', adminOnly, validate(updateCategorySchema), updateCategoryBySlug);
router.delete('/:slug', adminOnly, deleteCategoryBySlug);

export default router;