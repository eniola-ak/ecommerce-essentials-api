import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '../validations/productValidation';

export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema> & { slug?: string };