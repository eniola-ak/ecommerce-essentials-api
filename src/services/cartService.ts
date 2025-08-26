import * as cartRepo from '../repositories/cartRepository';
import { Product } from '../models';
import { AddItemToCart,UpdateCartItem } from '../interface/cartInterface';

export const getUserCart = async (userId: number) => {
  return cartRepo.findCartByUserId(userId);
};

export const addToCart = async (userId: number, { productId, quantity }: AddItemToCart) => {
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
) => {
  return cartRepo.updateCartItem(itemId, userId, data.quantity);
};

export const deleteCartItem = async (userId: number, itemId: number) => {
  return cartRepo.removeCartItem(itemId, userId);
};
