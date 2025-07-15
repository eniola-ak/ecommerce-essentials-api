import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

export const register= async (email: string, username: string, password: string, confirmPassword: string) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });
    return {
        userId: user.userId,
        email: user.email,
        role: user.role,
            
    };
};

export const login = async (email: string, password: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
    const token = generateToken({
        id: user.userId,
        email: user.email,
        role: user.role});

        return {token};
    };