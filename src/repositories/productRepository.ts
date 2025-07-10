import { Product } from '../models/Product';
import { Op } from 'sequelize';

export const createProduct = (data: any) => {
  return Product.create(data);
};

export const findAllProducts = (filters: any, limit: number, offset: number) => {
  return Product.findAndCountAll({
    where: filters,
    limit,
    offset,
    include: ['category'],
  });
};

export const findProductBySlug = (slug: string) => {
  return Product.findOne({
    where: { slug },
    include: ['category'],
  });
};

export const updateProduct = async (product: Product) => {
  return product.save();
};

export const deleteProduct = async (product: Product) => {
  return product.destroy();
};