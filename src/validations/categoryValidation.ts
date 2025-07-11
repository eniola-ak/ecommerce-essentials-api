import { z } from 'zod';

const baseCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const createCategorySchema = baseCategorySchema.strict();

export const updateCategorySchema = baseCategorySchema
  .partial()
  .strict()
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update the category.',
  });
