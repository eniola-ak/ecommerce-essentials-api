import * as cartRepo from '../repositories/cartRepository';
import { Product } from '../models';

export const getUserCart = async (userId: number) => {
  return await cartRepo.findCartByUserId(userId);
};

export const addToCart = async (userId: number, productId: number, quantity: number) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  const cart = await cartRepo.createCartIfNotExist(userId);
  const cartItem = await cartRepo.addItemToCart(cart.cartId, productId, quantity);

  return cartItem;
};
