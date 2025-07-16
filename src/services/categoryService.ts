import * as categoryRepo from '../repositories/categoryRepository';
import slugify from 'slugify';
import { CreateCategory, UpdateCategory } from '../interface/categoryInterface';

const generateSlug = (name: string) => slugify(name, { lower: true });

export const createNewCategory = async (payload: CreateCategory) => {
  const { name, description } = payload;
  const slug = slugify(name, { lower: true });

  const existing = await categoryRepo.findCategoryBySlug(slug);
  if (existing) {
    throw new Error('Category with this slug already exists.');
  }

  return categoryRepo.createCategory({ name, description });
};

export const getCategories = () => {
  return categoryRepo.findAllCategories();
};

export const getCategory = (slug: string) => {
  return categoryRepo.findCategoryBySlug(slug);
};

export const updateCategoryBySlug = async (
  slug: string,
  updates: UpdateCategory
) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw new Error('Category not found.');

  if (updates.name) {
    const newSlug = require('slugify')(updates.name, { lower: true });
    const existing = await categoryRepo.findCategoryBySlug(newSlug);

    if (existing && existing.id !== category.id) {
      throw new Error('Another category with this name/slug already exists.');
    }
  }

  return categoryRepo.updateCategory(category, updates);
};

export const deleteCategoryBySlug = async (slug: string) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw new Error('Category not found.');

  await categoryRepo.deleteCategory(category);
};