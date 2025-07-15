import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { TokenPayload } from '../interface/userInterface';
import { AuthenticatedRequest } from '../interface/userInterface';

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  
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
