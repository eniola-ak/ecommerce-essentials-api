import * as productRepo from '../repositories/productRepository';
import { Op } from 'sequelize';
import slugify from 'slugify';
import { CreateProduct, UpdateProduct } from '../interface/productInterface';


export const createNewProduct = async (data: CreateProduct) => {
  const slug = slugify(data.title,{ lower: true });

  const existing = await productRepo.findProductBySlug(slug);
  if (existing) {
    throw new Error('Product with this slug already exists.');
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
  updates: UpdateProduct
) => {
  const product = await productRepo.findProductBySlug(slug);
  if (!product) throw new Error('Product not found.');

  if (updates.title) {
    const newSlug = slugify(updates.title, { lower: true });

    if (newSlug !== slug) {
      const existing = await productRepo.findProductBySlug(newSlug);
      if (existing) throw new Error('Another product with this slug already exists.');
    }
  }

  return productRepo.updateProduct(product, updates);
};

export const deleteProductBySlug = async (slug: string) => {
  const product = await productRepo.findProductBySlug(slug);
  if (!product) throw new Error('Product not found.');
  return productRepo.deleteProduct(product);
};