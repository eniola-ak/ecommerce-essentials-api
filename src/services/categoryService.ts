import * as categoryRepo from '../repositories/categoryRepository';
import { Category } from '../models/Category';

export const createNewCategory = async (name: string, slug: string, description?: string) => {
  if (!name || !slug) {
    throw new Error('Name and slug are required.');
  }

  const existing = await categoryRepo.findCategoryBySlug(slug);
  if (existing) {
    throw new Error('Category with this slug already exists.');
  }

  return categoryRepo.createCategory({ name, slug, description });
};

export const getCategories = () => {
  return categoryRepo.findAllCategories();
};

export const getCategory = (slug: string) => {
  return categoryRepo.findCategoryBySlug(slug);
};

export const updateCategoryBySlug = async (
  slug: string,
  updates: { name?: string; newSlug?: string; description?: string }
) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw new Error('Category not found.');

  if (updates.newSlug && updates.newSlug !== slug) {
    const slugExists = await categoryRepo.findCategoryBySlug(updates.newSlug);
    if (slugExists) throw new Error('Another category with the new slug already exists.');
    category.slug = updates.newSlug;
  }

  category.name = updates.name ?? category.name;
  category.description = updates.description ?? category.description;

  return categoryRepo.updateCategory(category);
};

export const deleteCategoryBySlug = async (slug: string) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw new Error('Category not found.');

  await categoryRepo.deleteCategory(category);
};