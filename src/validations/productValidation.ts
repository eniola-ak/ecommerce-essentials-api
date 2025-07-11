import { z } from 'zod';

const baseProductSchema = z.object({
  title: z.string().min(1),
  price: z.number().nonnegative(),
  stockQuantity: z.number().nonnegative(),
  categoryId: z.number().int().positive(),
  image: z.string().url(),
  description: z.string().optional(),
});

export const createProductSchema = baseProductSchema.strict();

export const updateProductSchema = baseProductSchema
  .partial()
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update the product.',
  });