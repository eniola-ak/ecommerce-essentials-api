import { generateToken } from '../utils/jwt';
import * as userRepo from '../repositories/userRepository';
import { RegisterUserInput, LoginUserInput } from '../interface/userInterface';
import bcrypt from 'bcrypt';

export const register= async (input:RegisterUserInput) => {
    const { username, email, password, confirmPassword,role } = input;
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const user = await userRepo.createUser(email, username, password,role );
    const token = generateToken({
        id: user.userId,
        email: user.email,
        role: user.role
    });
    return {
        userId: user.userId,
        email: user.email,
        role: user.role,
        token: token,   
    };
};

export const login = async ({email, password}:LoginUserInput) => {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
    const token = generateToken({
        id: user.userId,
        email: user.email,
        role: user.role});

        return {userId: user.userId, email: user.email, username: user.username, role: user.role, token};
    };

export const getCurrentUserById = async (userId: number) => {
    const user = await userRepo.findUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return {
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
  };
};

export const createUserWithRole = async (
  email: string,
  username: string,
  password: string,
  role: 'user' | 'admin'
) => {
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  return await userRepo.createUserWithRole({email, username, password, role});
};

export const promoteUserToAdmin = async (email: string) => {
  return await userRepo.promoteToAdminByEmail(email);
};