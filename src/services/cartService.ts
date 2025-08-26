import * as cartRepo from '../repositories/cartRepository';
import { Product } from '../models';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { AddItemToCart,UpdateCartItem } from '../interface/cartInterface';

export const getUserCart = async (userId: number): Promise<Cart | null>=> {
  return cartRepo.findCartByUserId(userId);
};

export const addToCart = async (userId: number, { productId, quantity }: AddItemToCart) : Promise<CartItem>=> {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const cart = await cartRepo.createCartIfNotExist(userId);
  const cartItem = await cartRepo.addItemToCart(cart.cartId, productId, quantity);

  return cartItem;
};

export const updateCartItem = async (
  userId: number,
  itemId: number,
  data: UpdateCartItem
): Promise<CartItem | null> => {
  return cartRepo.updateCartItem(itemId, userId, data.quantity);
};

export const deleteCartItem = async (userId: number, itemId: number) : Promise<void>=> {
  return cartRepo.removeCartItem(itemId, userId);
};
