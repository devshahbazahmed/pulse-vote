import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../utils/cert.js';
import type { JWTClaims } from '../utils/user-token.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  let claims: JWTClaims;

  try {
    // @ts-ignore
    claims = jwt.verify(token, PUBLIC_KEY!, {
      algorithms: ['RS256'],
    }) as JWTClaims;

    req.user = claims;

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }
};
