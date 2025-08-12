import { Order, OrderCreationAttributes } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';

export const createOrder = async (orderData: OrderCreationAttributes & { orderItems?: any[] }) => {
  return Order.create(orderData, {
    include: [{ model: OrderItem, as: 'orderItems' }],
  });
};

export const findOrderByNumber = async (orderNumber: string) => {
  return Order.findOne({
    where: { orderNumber },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'productDetails',
            attributes: ['slug', 'title'],
          },
        ],
      },
    ],
  });
};
