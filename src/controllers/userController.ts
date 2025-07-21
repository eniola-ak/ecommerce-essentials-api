import {Request, Response} from 'express';
import * as userService from '../services/userService';
import { registerUserSchema,loginUserSchema } from '../validations/userValidations';
import { AuthenticatedRequest } from '../interface/userInterface';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const parsed = registerUserSchema.parse(req.body);
    const user = await userService.register(parsed);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const parsed = loginUserSchema.parse(req.body);
    const user = await userService.login(parsed);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(401).json({message: error.message});
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: 'Unauthorized: Invalid token or missing user' });
    }
    const user = await userService.getCurrentUserById(req.user.id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

<<<<<<< HEAD
export const createUserWithRole = async (req: Request, res: Response): Promise<void> => {
=======
/*export const createUserWithRole = async (req: Request, res: Response): Promise<void> => {
>>>>>>> 2936e94 (Save untracked user files before merging)
  const { email, username, password, role } = req.body;

  try {
    const user = await userService.createUserWithRole(email, username, password, role);
    res.status(201).json({ message: `User created as ${role}`, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
<<<<<<< HEAD
};
=======
};*/
>>>>>>> 2936e94 (Save untracked user files before merging)

export const promoteUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await userService.promoteUserToAdmin(email);
    res.status(200).json({ message: `${user.username} is now an admin.` });
  } catch (err: any) {
    res.status(err.message === 'User not found' ? 404 : 500).json({ message: err.message });
  }
};