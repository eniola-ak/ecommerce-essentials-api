import { Request, Response, NextFunction } from 'express';

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing Authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Temporary check for admin token
  if (token !== 'admin') {
    res.status(403).json({ message: 'Admins only' });
    return;
  }

  // Simulate setting user data (as if decoded from JWT)
  (req as any).user = {
    id: 1,
    email: 'admin@example.com',
    role: 'admin',
  };

  next();
};