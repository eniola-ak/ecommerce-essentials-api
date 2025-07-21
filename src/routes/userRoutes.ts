import express from 'express';
<<<<<<< HEAD
import { registerUser,loginUser,getCurrentUser,createUserWithRole,promoteUser } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema,createUserWithRoleSchema } from '../validations/userValidations';
=======
import { registerUser,loginUser,getCurrentUser,promoteUser } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema,} from '../validations/userValidations';
>>>>>>> 2936e94 (Save untracked user files before merging)
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/adminOnly';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);

router.get('/me', authenticateJWT, getCurrentUser);
<<<<<<< HEAD
router.post('/createUserWithRole', adminOnly, validate(createUserWithRoleSchema), createUserWithRole);
=======
/*router.post('/users', adminOnly, validate(createUserWithRoleSchema), createUserWithRole);*/
>>>>>>> 2936e94 (Save untracked user files before merging)
router.post('/promote', adminOnly, promoteUser);

export default router;