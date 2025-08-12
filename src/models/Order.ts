import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { OrderItemCreationAttributes } from './OrderItem';

export interface OrderAttributes {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, 'id' | 'orderNumber' | 'orderStatus'> {orderItems?: OrderItemCreationAttributes[]}

export class Order extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes {
  declare id: number;
  declare orderNumber: string;
  declare userId: number;
  declare totalAmount: number;
  declare orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  declare createdAt?: Date;
  declare updatedAt?: Date;

  static initModel(sequelize: Sequelize): typeof Order {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        orderNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        orderStatus: {
          type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
      },
      {
        sequelize,
        tableName: 'orders',
        timestamps: true,
      }
    );
    return Order;
  }
}
