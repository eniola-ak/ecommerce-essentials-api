import { Request, Response, NextFunction } from 'express';

export const adminOnly = (_req: Request, res: Response, next: NextFunction): void => {
  const isAdmin = true; // replace with real logic
  if (!isAdmin) {
    res.status(403).json({ message: 'Admins only' });
    return;
  }
  next();
};