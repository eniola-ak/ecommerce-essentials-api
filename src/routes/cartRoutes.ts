import express from 'express';
import { getCart, addItem } from '../controllers/cartController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { customerOnly } from '../middleware/adminOnly';

const router = express.Router();

router.get('/cart', authenticateJWT, customerOnly, getCart);
router.post('/cart/items', authenticateJWT, customerOnly, addItem);

export default router;
