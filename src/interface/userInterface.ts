import { Request } from 'express';
export interface TokenPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
}
export interface AuthenticatedRequest extends Request {
  user?: any;
}