import express from 'express';
import { getCart, addItem, updateCartItem, deleteCartItem } from '../controllers/cartController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { customerOnly } from '../middleware/roleMiddleware';

const router = express.Router();

const customerMiddleware=[authenticateJWT,customerOnly]

router.get('/', customerMiddleware, getCart);
router.post('/items', customerMiddleware, addItem);
router.put('/items/:itemId', authenticateJWT, customerMiddleware, updateCartItem);
router.delete('/items/:itemId', authenticateJWT, customerMiddleware, deleteCartItem);

export default router;
