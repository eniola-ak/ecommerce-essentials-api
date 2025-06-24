import 'dotenv/config';
import { Sequelize } from 'sequelize';
import { Category } from './Category';
import { Product } from './Product';
import { User } from './User';

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

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export { sequelize, Category, Product, User };