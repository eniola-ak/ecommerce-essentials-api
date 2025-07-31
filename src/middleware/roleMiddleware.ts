import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, TokenPayload } from '../interface/userInterface';

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Access denied: admins only' });
    return;
  }
  next();
};

export const customerOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'customer') {
    res.status(403).json({ message: 'Access denied: customers only' });
    return;
  }
  next();
};

