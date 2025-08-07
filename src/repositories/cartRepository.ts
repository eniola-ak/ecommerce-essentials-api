import { Cart, CartItem, Product, User } from '../models';

export const findCartByUserId = async (userId: number) => {
  return await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product'
          }
        ]
      }
    ]
  });
};

export const createCartIfNotExist = async (userId: number) => {
  const [cart] = await Cart.findOrCreate({ where: { userId } });
  return cart;
};

export const addItemToCart = async (
  cartId: number,
  productId: number,
  quantity: number
) => {
  const existingItem = await CartItem.findOne({
    where: { cartId, productId }
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    return await existingItem.save();  //ret
  }

  return await CartItem.create({ cartId, productId, quantity });
};

export const updateCartItem = async (itemId: number, userId: number,quantity: number) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) throw new Error('Cart not found for user');

  const cartItem = await CartItem.findOne({
    where: { id: itemId, cartId: cart.cartId }
  });
  if (!cartItem) {
    throw new Error('Cart item not found');
  }
  cartItem.quantity = quantity;
  return await cartItem.save();
};

export const removeCartItem = async (itemId: number, userId: number) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) throw new Error('Cart not found for user');

  const deletedCount = await CartItem.destroy({
    where: { id: itemId, cartId: cart.cartId }
  });
  if (deletedCount === 0) {
    throw new Error('Cart item not found');
  }
};