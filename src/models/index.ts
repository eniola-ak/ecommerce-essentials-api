import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';
import { Cart } from './Cart';
import { CartItem } from './CartItem';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  }
);

// Init models
Category.initModel(sequelize);
Product.initModel(sequelize);
User.initModel(sequelize);
Cart.initModel(sequelize);
CartItem.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
User.hasOne(Cart, {foreignKey: 'userId', as: 'cart',});
Cart.belongsTo(User, {foreignKey: 'userId', as: 'user',});
Cart.hasMany(CartItem, {foreignKey: 'cartId',as: 'items',});
CartItem.belongsTo(Cart, {foreignKey: 'cartId',as: 'cart',});
CartItem.belongsTo(Product, {foreignKey: 'productId',as: 'product',});
Product.hasMany(CartItem, {foreignKey: 'productId',as: 'cartItems',});
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'productDetails' });

export { sequelize, Category, Product, User, Cart, CartItem };