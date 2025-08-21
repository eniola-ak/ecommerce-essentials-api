import { Order, OrderCreationAttributes } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import { WhereOptions } from 'sequelize';
import { User } from '../models/User';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';


export const createOrder = async (orderData: OrderCreationAttributes & { orderItems: any[] }):Promise<Order> => {
  return Order.create(orderData, {
    include: [
      {
        model: OrderItem,
        as: 'orderItems', // must match Order.hasMany(OrderItem, { as: 'orderItems' })
      },
    ],
  });
};

export const findOrderByNumber = async (orderNumber: string):Promise<Order | null> => {
  return Order.findOne({
    where: { orderNumber },
    include: [
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['slug', 'title'],
          },
        ],
      },
    ],
  });
};

export const findAllOrders = (filters: WhereOptions, limit: number, offset: number):Promise<{ rows: Order[]; count: number }> => {
  return Order.findAndCountAll({
    where: filters,
    limit,
    offset,
    distinct: true,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['userId', 'email']
      },
      {
        model: OrderItem,
        as: 'orderItems',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'slug', 'title', 'price']
          }
        ]
      },
    ],
    order: [['createdAt', 'DESC']],
  });
};

export const updateOrderStatus = async (
  orderNumber: string,
  newStatus: OrderStatus
): Promise<Order | null> => {
  const order = await Order.findOne({ where: { orderNumber } });
  if (!order) return null;

  await Order.update({ orderStatus: newStatus }, { where: { orderNumber } });

  return await Order.findOne({ where: { orderNumber } }); 
};