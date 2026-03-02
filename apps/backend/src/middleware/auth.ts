import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type JwtPayload = { id: string; role: string };

export const authGuard = (roles: string[] = []) => (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    (req as Request & { user?: JwtPayload }).user = payload;
    if (roles.length > 0 && !roles.includes(payload.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
