import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema } from '../validations/userValidations';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);