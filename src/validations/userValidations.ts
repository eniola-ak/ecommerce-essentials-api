import {z} from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(6),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}); 

