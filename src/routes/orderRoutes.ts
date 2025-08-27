import { Router } from 'express';
import { createOrder, getOrder,getAdminOrders,updateOrderStatus } from '../controllers/orderController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminOnly, customerOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/', customerOnly, createOrder);
router.get('/:orderNumber', authenticateJWT, getOrder);
router.get('/', adminOnly, getAdminOrders);
router.put('/:orderNumber/status', adminOnly, updateOrderStatus);


export default router;
