import { z } from 'zod';
import { registerUserSchema, loginUserSchema } from '../validations/userValidations';
import { Request } from 'express';
export interface TokenPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
}
export interface AuthenticatedRequest extends Request {
  user?: any;
}

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;

export interface UserInput {
  email: string;
  username: string;
  password: string;
  role: 'user' | 'admin';
}