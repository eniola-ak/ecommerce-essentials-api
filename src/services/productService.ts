import * as productRepo from '../repositories/productRepository';
import { Op } from 'sequelize';
import slugify from 'slugify';

export const createNewProduct = async (data: any) => {
  const { title, price, stockQuantity, categoryId } = data;

  if (!title || !price || !stockQuantity || !categoryId) {
    throw new Error('Missing required fields');
  }

  if (!data.slug) {
    data.slug = slugify(title, { lower: true });
  }

  return productRepo.createProduct(data);
};

export const getProducts = async (query: any) => {
  const { categoryId, search, limit = '10', offset = '0' } = query;

  const filters: any = {};
  if (categoryId) filters.categoryId = categoryId;
  if (search) filters.title = { [Op.like]: `%${search}%` };

  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  const result = await productRepo.findAllProducts(filters, limitNum, offsetNum);
  return {
    count: result.count,
    products: result.rows,
  };
};

export const getProductBySlug = (slug: string) => {
  return productRepo.findProductBySlug(slug);
};