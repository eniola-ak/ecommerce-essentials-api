import {Request, Response} from 'express';
import * as userService from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const user = await userService.register(username, email, password, confirmPassword);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({message: error.message});
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const result = await userService.login(email, password);
    res.status(200).json({result});
  } catch (error: any) {
    res.status(401).json({message: error.message});
  }
};