import * as categoryRepo from '../repositories/categoryRepository';
import slugify from 'slugify';
import { CreateCategory, UpdateCategory } from '../interface/categoryInterface';

const generateSlug = (name: string) => slugify(name, { lower: true });

export const createNewCategory = async (payload: CreateCategory) => {
  const { name, description } = payload;
  const slug = generateSlug(name);

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
  updates: UpdateCategory
) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw new Error('Category not found.');

  if (updates.name) {
    // Regenerate slug from new name
    const regeneratedSlug = generateSlug(updates.name);

    // Prevent slug collision with another category
    if (regeneratedSlug !== slug) {
      const slugExists = await categoryRepo.findCategoryBySlug(regeneratedSlug);
      if (slugExists) throw new Error('Another category with this slug already exists.');
    }

    updates.slug = regeneratedSlug;
  }

  return categoryRepo.updateCategory(category, updates);
};

export const deleteCategoryBySlug = async (slug: string) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) throw new Error('Category not found.');

  await categoryRepo.deleteCategory(category);
};