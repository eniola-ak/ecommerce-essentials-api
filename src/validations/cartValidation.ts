import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1)
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
});