import * as orderRepo from '../repositories/orderRepository';
import * as cartRepo from '../repositories/cartRepository';
import { generateOrderNumber } from '../utils/orderUtils';
import { OrderCreationAttributes } from '../models/Order';
import { CartItemAttributes } from '../models/CartItem';
import { Product } from '../models/Product';

interface CartWithItems {
  cartId: number;
  userId: number;
  totalAmount: number;
  items: (CartItemAttributes & {
    product?: { price: string, stockQuantity: number };
  })[];
}

export const createOrderFromCart = async (userId: number) => {
  const cart = (await cartRepo.findCartByUserId(userId)) as unknown as CartWithItems;

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  for (const item of cart.items) {
    if (!item.product) {
      throw new Error(`Product details missing for productId: ${item.productId}`);
    }
    if (item.quantity > item.product.stockQuantity) {
      throw new Error(
        `Not enough stock for product ID ${item.productId}. Available: ${item.product.stockQuantity}, Requested: ${item.quantity}`
      );
    }
  

  const totalAmount = cart.items.reduce((sum, item) => {
    const price = parseFloat(item.product?.price ?? '0');
    return sum + item.quantity * price;
  }, 0);


  const orderData: OrderCreationAttributes & {
    orderItems: { productId: number; quantity: number; price: number }[];
  } = {
    orderNumber: generateOrderNumber(),
    userId,
    totalAmount,
    orderStatus: 'PENDING',
    orderItems: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: parseFloat(item.product?.price ?? '0'),
    })),
  };


  const order = await orderRepo.createOrder(orderData);

  for (const item of cart.items) {
    await Product.update(
      { stockQuantity: item.product!.stockQuantity - item.quantity },
      { where: { id: item.productId } }
    );
  }
  await cartRepo.clearCart(userId);

  return order;
};
};

export const getOrderByNumber = async (
  orderNumber: string,
  userId: number,
  isAdmin: boolean
) => {
  const order = await orderRepo.findOrderByNumber(orderNumber);

  if (!order) {
    throw new Error('Order not found');
  }

  if (!isAdmin && order.userId !== userId) {
    throw new Error('Unauthorized access');
  }

  return order;
};