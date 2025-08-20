import { Order, OrderCreationAttributes } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import { WhereOptions } from 'sequelize';
import { User } from '../models/User';


export const createOrder = async (orderData: OrderCreationAttributes & { orderItems: any[] }) => {
  return Order.create(orderData, {
    include: [
      {
        model: OrderItem,
        as: 'orderItems', // must match Order.hasMany(OrderItem, { as: 'orderItems' })
      },
    ],
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
            as: 'product',
            attributes: ['slug', 'title'],
          },
        ],
      },
    ],
  });
};

export const findAllOrders = (filters: WhereOptions, limit: number, offset: number) => {
  return Order.findAndCountAll({
    where: filters,
    limit,
    offset,
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
  newStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
) => {
  const order = await Order.findOne({ where: { orderNumber } });
  if (!order) return null;

  await Order.update(
    { orderStatus: newStatus },
    { where: { orderNumber } }
  );

  return await Order.findOne({ where: { orderNumber } }); // return fresh copy
};