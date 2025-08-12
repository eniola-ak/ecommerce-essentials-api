import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

export class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes {
  declare id: number;
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
  declare price: number;

  static initModel(sequelize: Sequelize): typeof OrderItem {
    OrderItem.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'order_items',
        timestamps: false,
      }
    );
    return OrderItem;
  }
}
