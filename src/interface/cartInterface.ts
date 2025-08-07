import {z} from 'zod';
import {addItemSchema,updateCartItemSchema} from "../validations/cartValidation";

export type AddItemToCart = z.infer<typeof addItemSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;