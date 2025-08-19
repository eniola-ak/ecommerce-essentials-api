import * as orderRepo from '../repositories/orderRepository';
import * as cartRepo from '../repositories/cartRepository';
import { generateOrderNumber } from '../utils/orderUtils';
import { OrderCreationAttributes} from '../models/Order';
import { CartItem } from '../models/CartItem';
import { Product } from '../models/Product';
import { WhereOptions} from 'sequelize';


interface CartWithItems {
  cartId: number;
  userId: number;
  totalAmount: number;
  items: (CartItem & { product?: Product })[];
}

export const createOrderFromCart = async (userId: number) => {
  // Fetch the cart including items and products
  const cartInstance = await cartRepo.findCartByUserId(userId);

  const cart = cartInstance as unknown as CartWithItems;

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  // Check stock availability
  for (const item of cart.items) {
    if (!item.product) {
      throw new Error(`Product details missing for productId: ${item.productId}`);
    }
    if (item.quantity > item.product.stockQuantity) {
      throw new Error(
        `Not enough stock for product ID ${item.productId}. Available: ${item.product.stockQuantity}, Requested: ${item.quantity}`
      );
    }
  }

  // Calculate total amount
  const totalAmount = cart.items.reduce((sum, item) => {
    const price = parseFloat(item.product!.price.toString());
    return sum + item.quantity * price;
  }, 0);

  // Prepare order data
  const orderData: OrderCreationAttributes & {
    orderItems: { productId: number; quantity: number; price: number }[];
  } = {
    orderNumber: generateOrderNumber(),
    userId,
    totalAmount,
    orderStatus: 'PENDING', // ✅ correct type
    orderItems: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: parseFloat(item.product!.price.toString()),
    })),
  };

  // Create order
  const order = await orderRepo.createOrder(orderData);

  // Update stock quantities
  for (const item of cart.items) {
    await Product.update(
      { stockQuantity: item.product!.stockQuantity - item.quantity },
      { where: { id: item.productId } }
    );
  }

  // Clear the cart
  await cartRepo.clearCart(userId);

  return order;
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

export const getAllOrders = async (
  status?: string,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const filters: WhereOptions = {};
  
  if (status) {
    filters.orderStatus = status;
  }

  const result = await orderRepo.findAllOrders(filters, limit, offset);
  
  return {
    orders: result.rows,
    totalCount: result.count,
    totalPages: Math.ceil(result.count / limit),
    currentPage: page,
    hasNextPage: page < Math.ceil(result.count / limit),
    hasPrevPage: page > 1
  };
};

export const changeOrderStatus = async (
  orderNumber: string,
  newStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) => {
  
  const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Invalid order status');
  }

  const order = await orderRepo.updateOrderStatus(orderNumber, newStatus);
  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};