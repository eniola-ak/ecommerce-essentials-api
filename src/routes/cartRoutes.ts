import express from 'express';
import { getCart, addItem } from '../controllers/cartController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { customerOnly } from '../middleware/roleMiddleware';

const router = express.Router();

const customerMiddleware=[authenticateJWT,customerOnly]

router.get('/', customerMiddleware, getCart);
router.post('/items', customerMiddleware, addItem);

export default router;
