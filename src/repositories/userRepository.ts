import { User } from '../models/User';
import { UserInput } from '../interface/userInterface';

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const findUserById = async (userId: number) => {
  return await User.findByPk(userId);
};

export const createUser = async (
  email: string,
  username: string,
  password: string,
  role: 'customer' | 'admin' = 'customer'
) => {
  return await User.create({ email, username, password });
};

export const updatePassword = async (
  userId: number,
  newPassword: string
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  user.password = newPassword;
  await user.save();

  return user;
};

export const createUserWithRole = async (data: UserInput) => {
  return await User.create(data);
};

export const promoteToAdminByEmail = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');

  user.role = 'admin';
  await user.save();

  return user;
};