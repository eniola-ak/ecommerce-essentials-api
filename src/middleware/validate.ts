import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction):void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    // Optionally override req.body with parsed data
    req.body = result.data;
    next();
  };
};