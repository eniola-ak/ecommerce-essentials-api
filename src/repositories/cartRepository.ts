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
    return await existingItem.save();
  }

  return await CartItem.create({ cartId, productId, quantity });
};
