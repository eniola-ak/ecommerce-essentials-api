import { Request, Response } from 'express';
import { Category } from '../models/category';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description } = req.body;

    // Basic validation
    if (!name || !slug) {
      res.status(400).json({ message: 'Name and slug are required.' });
      return;
    }

    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      res.status(409).json({ message: 'Category with this slug already exists.' });
      return;
    }

    const category = await Category.create({ name, slug, description });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ where: { slug } });

    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};