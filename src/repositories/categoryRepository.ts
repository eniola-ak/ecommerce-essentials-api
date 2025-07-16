import { Category } from '../models/Category';
import { CreateCategory } from '../interface/categoryInterface';

export const findCategoryBySlug = (slug: string) => {
  return Category.findOne({ where: { slug } });
};

export const findAllCategories = () => {
  return Category.findAll();
};

export const createCategory = (data: CreateCategory) => {
  return Category.create(data);
};

export const updateCategory = (category: Category, updates: Partial<Category>) => {
  return category.update(updates);
};

export const deleteCategory = (category: Category) => {
  return category.destroy();
};