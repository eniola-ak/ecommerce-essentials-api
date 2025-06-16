import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Category } from '../models/category';
import { Product } from '../models/product';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Category, Product],
  logging: false
});