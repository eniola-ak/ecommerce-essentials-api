import { Request, Response, NextFunction } from 'express';
import {verifyToken} from '../utils/jwt';
import { TokenPayload } from '../interface/userInterface';

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

 try {
    const decoded = verifyToken(token) as TokenPayload;

    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Admins only' });
      return;
    }

    (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};