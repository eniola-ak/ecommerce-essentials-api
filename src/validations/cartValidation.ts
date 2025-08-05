import { z } from 'zod';

export const addItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1)
});