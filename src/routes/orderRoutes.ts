import { Router } from 'express';
import { createOrder, getOrder } from '../controllers/orderController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { customerOnly } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', authenticateJWT, customerOnly, createOrder);

router.get('/:orderNumber', authenticateJWT, getOrder);

export default router;
