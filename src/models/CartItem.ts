import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  productDetails?: string;
  slug?: string;
  title?: string;
  price?: number;
  image?: string;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id'> {}

export class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes {
  declare id: number;
  declare cartId: number;
  declare productId: number;
  declare quantity: number;
  declare productDetails?: string;
  declare slug?: string;
  declare title?: string;
  declare price?: number;
  declare image?: string;

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
        productDetails: {
          type: DataTypes.STRING,
        },
        slug: {
          type: DataTypes.STRING,
        },
        title: {
          type: DataTypes.STRING,
        },
        price: {
          type: DataTypes.FLOAT,
        },
        image: {
          type: DataTypes.STRING,
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
