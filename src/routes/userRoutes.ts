import express from 'express';
import { registerUser,loginUser,getCurrentUser,promoteUser } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema,} from '../validations/userValidations';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);

router.get('/me', authenticateJWT, getCurrentUser);
/*router.post('/users', adminOnly, validate(createUserWithRoleSchema), createUserWithRole);*/
router.post('/promote', adminOnly, promoteUser);

export default router;