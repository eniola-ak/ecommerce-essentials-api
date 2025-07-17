import express from 'express';
import { registerUser,loginUser,getCurrentUser,createUserWithRole,promoteUser } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema,createUserWithRoleSchema } from '../validations/userValidations';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminOnly';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);

router.get('/me', authenticateJWT, getCurrentUser);
router.post('/createUserWithRole', adminOnly, validate(createUserWithRoleSchema), createUserWithRole);
router.post('/promote', adminOnly, promoteUser);

export default router;