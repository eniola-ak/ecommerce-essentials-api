import { Request, Response } from 'express';
import * as productService from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createNewProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { products, count } = await productService.getProducts(req.query);
    res.status(200).json({ count, products });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};