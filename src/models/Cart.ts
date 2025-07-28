import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CartAttributes {
  cartId: number;
  userId: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  cartItem?: string;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'cartId'> {}

export class Cart extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes {
  declare cartId: number;
  declare userId: number;
  declare totalAmount: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare cartItem?: string;

  static initModel(sequelize: Sequelize): typeof Cart {
    Cart.init(
      {
        cartId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.FLOAT,
          defaultValue: 0,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        cartItem: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        tableName: 'Cart',
      }
    );
    return Cart;
  }
}
