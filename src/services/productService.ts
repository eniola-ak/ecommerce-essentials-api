import * as productRepo from '../repositories/productRepository';
import { Op } from 'sequelize';
import slugify from 'slugify';

export const createNewProduct = async (data: any) => {
  const { title, price, stockQuantity, categoryId, image } = data;

  if (!title || !price || !stockQuantity || !categoryId || !image) {
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

export const updateProductBySlug = async (
  slug: string,
  updates: {title?: string; slug?: string; price?: number; stockQuantity?: number; categoryId?: number; description?: string; image?: string;
  }) => {
  const product = await productRepo.findProductBySlug(slug);
  if (!product) throw new Error('Product not found.');

  if (updates.slug && updates.slug !== slug) {
    const existing = await productRepo.findProductBySlug(updates.slug);
    if (existing) throw new Error('Another product with this slug already exists.');
    product.slug = updates.slug;
  }

  if (updates.title && !updates.slug) {
    product.slug = slugify(updates.title, { lower: true });
  }

  product.title = updates.title ?? product.title;
  product.price = updates.price ?? product.price;
  product.stockQuantity = updates.stockQuantity ?? product.stockQuantity;
  product.categoryId = updates.categoryId ?? product.categoryId;
  product.description = updates.description ?? product.description;
  product.image=updates.image ?? product.image; 

  return productRepo.updateProduct(product);
};

export const deleteProductBySlug = async (slug: string) => {
  const product = await productRepo.findProductBySlug(slug);
  if (!product) throw new Error('Product not found.');
  return productRepo.deleteProduct(product);
};