import { Router, Request, Response, NextFunction } from 'express';
import {
  createProduct,
  getProducts,
  getProductBySlug,
} from '../controllers/productController';

import { adminOnly } from '../middleware/adminOnly';

const router = Router();

// Routes
router.post('/', adminOnly, createProduct);
router.get('/', getProducts);
router.get('/:slug',getProductBySlug );

export default router;