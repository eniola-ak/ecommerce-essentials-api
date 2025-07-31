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

import { adminOnly } from '../middleware/roleMiddleware';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

const adminMiddlewares = [authenticateJWT,adminOnly];

// Routes
router.post('/', adminMiddlewares, validate(createProductSchema), createProduct);
router.get('/', getProducts);
router.get('/:slug',getProductBySlug );
router.patch('/:slug', adminMiddlewares, validate(updateProductSchema), updateProductBySlug);
router.delete('/:slug', adminMiddlewares, deleteProductBySlug);

export default router;