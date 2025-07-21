import {z} from 'zod';

const baseUserSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6),
  })
  .strict();

export const registerUserSchema = baseUserSchema
<<<<<<< HEAD
  .extend({confirmPassword:z.string().min(6), role: z.enum(['user', 'admin']).default('user')})
=======
  .extend({confirmPassword:z.string().min(6), role: z.enum(['customer', 'admin']).default('customer')})
>>>>>>> 2936e94 (Save untracked user files before merging)
  .strict().refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginUserSchema = baseUserSchema
  .pick({email: true, password: true,})
  .strict();

<<<<<<< HEAD
export const createUserWithRoleSchema = baseUserSchema
  .extend({
    role: z.enum(['user', 'admin']).default('user'),
  })
  .strict();
=======
/*export const createUserWithRoleSchema = baseUserSchema
  .extend({
    role: z.enum(['customer', 'admin']).default('customer'),
  })
  .strict();*/
>>>>>>> 2936e94 (Save untracked user files before merging)
