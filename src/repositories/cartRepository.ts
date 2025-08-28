import { Cart, CartItem, Product, User } from '../models';

export const findCartByUserId = async (userId: number):Promise<Cart | null> => {
  return Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items', 
        include: [
          {
            model: Product,
            as: 'product', 
            attributes: ['id', 'price', 'stockQuantity', 'title'],
          },
        ],
      },
    ],
  });
};


export const createCartIfNotExist = async (userId: number) : Promise<Cart> => {
  const [cart] = await Cart.findOrCreate({ where: { userId } });
  return cart;
};

export const addItemToCart = async (
  cartId: number,
  productId: number,
  quantity: number
): Promise<CartItem> => {
  const existingItem = await CartItem.findOne({
    where: { cartId, productId }
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    return await existingItem.save();  
  }

  return await CartItem.create({ cartId, productId, quantity });
};

export const updateCartItem = async (itemId: number, userId: number,quantity: number): Promise<CartItem> => {
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

export const removeCartItem = async (itemId: number, userId: number):Promise<void> => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) throw new Error('Cart not found for user');

  const deletedCount = await CartItem.destroy({
    where: { id: itemId, cartId: cart.cartId }
  });
  if (deletedCount === 0) {
    throw new Error('Cart item not found');
  }
};

export const clearCart = async (userId: number) :Promise<void> => {
  const cart = await Cart.findOne({ where: { userId } });

  if (!cart) {
    return;
  }
  await CartItem.destroy({
    where: { cartId: cart.cartId },
  });
  cart.totalAmount = 0;
  await cart.save();
};