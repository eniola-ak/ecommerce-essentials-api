import { Product } from '../models/Product';
import { CreateProduct } from '../interface/productInterface';
import { Op } from 'sequelize';

export const createProduct = (data: CreateProduct): Promise<Product> => {
  return Product.create(data);
};

export const findAllProducts = (filters: any, limit: number, offset: number): Promise<{ rows: Product[]; count: number }> => {
  return Product.findAndCountAll({
    where: filters,
    limit,
    offset,
    include: ['category'],
  });
};

export const findProductBySlug = (slug: string): Promise<Product | null> => {
  return Product.findOne({
    where: { slug },
    include: ['category'],
  });
};

export const updateProduct = async (product: Product, updates: Partial<Product>) : Promise<Product> => {
  return product.update(updates);
};

export const deleteProduct = async (product: Product): Promise<void> => {
  return product.destroy();
};