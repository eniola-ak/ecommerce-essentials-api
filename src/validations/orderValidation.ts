import { z } from 'zod';

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    required_error: 'Order status is required',
    invalid_type_error: 'Invalid order status value',
  }),
});
