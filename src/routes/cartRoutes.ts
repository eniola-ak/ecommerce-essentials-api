import express from 'express';
import { getCart, addItem, updateCartItem, deleteCartItem } from '../controllers/cartController';
import { customerOnly} from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', customerOnly, getCart);
router.post('/items', customerOnly, addItem);
router.put('/items/:itemId',  customerOnly, updateCartItem);
router.delete('/items/:itemId', customerOnly, deleteCartItem);

export default router;
