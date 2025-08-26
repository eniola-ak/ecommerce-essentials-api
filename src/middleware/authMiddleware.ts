import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { TokenPayload, AuthenticatedRequest } from '../interface/userInterface';

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get('Authorization') || '';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization token missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  authenticateJWT(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Access denied: admins only' });
      return;
    }
    next();
  });
};

export const customerOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  authenticateJWT(req, res, () => {
    if (req.user?.role !== 'customer') {
      res.status(403).json({ message: 'Access denied: customers only' });
      return;
    }
    next();
  });
};
