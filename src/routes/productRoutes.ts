import { Router, Request, Response, NextFunction } from 'express';
import {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProductBySlug,
  deleteProductBySlug
} from '../controllers/productController';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validations/productValidation';

import { adminOnly } from '../middleware/adminOnly';

const router = Router();

// Routes
router.post('/', adminOnly, validate(createProductSchema), createProduct);
router.get('/', getProducts);
router.get('/:slug',getProductBySlug );
router.patch('/:slug', adminOnly, validate(updateProductSchema), updateProductBySlug);
router.delete('/:slug', adminOnly, deleteProductBySlug);

export default router;