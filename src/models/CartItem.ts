import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes {
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  
  static initModel(sequelize: Sequelize): typeof CartItem {
    CartItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        cartId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'CartItem',
        timestamps: true,
      }
    );
    return CartItem;
  }
}
