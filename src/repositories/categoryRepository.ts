import { Category } from '../models/Category';
import { CreateCategory } from '../interface/categoryInterface';

export const findCategoryBySlug = (slug: string): Promise<Category | null> => {
  return Category.findOne({ where: { slug } });
};

export const findAllCategories = (): Promise<Category[]> => {
  return Category.findAll();
};

export const createCategory = (data: CreateCategory): Promise<Category> => {
  return Category.create(data);
};

export const updateCategory = (category: Category, updates: Partial<Category>): Promise<Category>=> {
  return category.update(updates);
};

export const deleteCategory = (category: Category): Promise<void> => {
  return category.destroy();
};