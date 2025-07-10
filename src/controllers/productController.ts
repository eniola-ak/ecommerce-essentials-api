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

export const updateProductBySlug = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await productService.updateProductBySlug(req.params.slug, req.body);
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error: any) {
    if (error.message === 'Product not found.') {
      res.status(404).json({ message: error.message });
      return;
    }

    if (error.message === 'Another product with this slug already exists.') {
      res.status(409).json({ message: error.message });
      return;
    }

    res.status(400).json({ message: error.message });
  }
};

export const deleteProductBySlug = async (req: Request, res: Response) => {
  try {
    await productService.deleteProductBySlug(req.params.slug);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Product not found.') {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(400).json({ message: error.message });
  }
};