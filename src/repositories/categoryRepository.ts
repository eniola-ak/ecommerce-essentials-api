import { Category } from '../models/Category';

export const findCategoryBySlug = (slug: string) => {
  return Category.findOne({ where: { slug } });
};

export const findAllCategories = () => {
  return Category.findAll();
};

export const createCategory = (data: {
  name: string;
  slug: string;
  description?: string;
}) => {
  return Category.create(data);
};

export const updateCategory = (category: Category) => {
  return category.save();
};

export const deleteCategory = (category: Category) => {
  return category.destroy();
};