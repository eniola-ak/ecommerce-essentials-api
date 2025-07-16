import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).nonnegative(),
  stockQuantity: z.number({ invalid_type_error: 'Stock quantity must be a number' }).nonnegative(),
  categoryId: z.number().int().positive(),
  slug: z.string().optional(),
  image: z.string().url('Image must be a valid URL'),
  description: z.string().optional(),
});

export const updateProductSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  categoryId: z.number().int().optional(),
  description: z.string().optional(),
});