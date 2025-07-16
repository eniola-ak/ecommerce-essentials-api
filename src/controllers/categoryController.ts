import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.createNewCategory({name, description});
    res.status(201).json(category);
  } catch (error: any) {
    res.status(error.message.includes('exists') ? 409 : 400).json({ message: error.message });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategory(slug);
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const updated = await categoryService.updateCategoryBySlug(slug, req.body);
    res.status(200).json(updated);
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 409;
    res.status(status).json({ message: error.message });
  }
};

export const deleteCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    await categoryService.deleteCategoryBySlug(slug);
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};