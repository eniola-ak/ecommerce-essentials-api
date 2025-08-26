import * as orderRepo from '../repositories/orderRepository';
import * as cartRepo from '../repositories/cartRepository';
import { generateOrderNumber } from '../utils/orderUtils';
import { PaginatedOrders } from '../interface/orderInterface';
import { CartAttributes}from '../models/Cart';
import { CartItemAttributes } from '../models/CartItem';
import { Order } from '../models/Order';
import { WhereOptions} from 'sequelize';
import { OrderStatus } from '../repositories/orderRepository';



interface CartWithItems extends CartAttributes {
  items: (CartItemAttributes & {
    product?: {
      id: number;
      price: string;
      stockQuantity: number;
      title: string;
    };
  })[];
}
export const createOrderFromCart = async (userId: number): Promise<Order> => {
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
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + parseFloat(item.product!.price) * item.quantity,
    0
  );

  const orderData = {
    orderNumber: generateOrderNumber(),
    userId: cart.userId,
    totalAmount,
    orderItems: cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: parseFloat(item.product!.price),
    })),
  };

  return orderRepo.createOrder(orderData);
};


export const getOrderByNumber = async (
  orderNumber: string,
  userId: number,
  isAdmin: boolean
): Promise<Order> => {
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
):Promise<PaginatedOrders>  => {
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
  newStatus: string
): Promise<Order> => {
  if (!newStatus) {
    throw new Error('orderStatus is required');
  }

  const validStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(newStatus as OrderStatus)) {
    throw new Error('Invalid orderStatus');
  }

  const order = await orderRepo.updateOrderStatus(orderNumber, newStatus as OrderStatus);
  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};