/** @format */

import config from '../../utils/config';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface IUser {
  id: string;
  email: string;
}
export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.headers.authorization === undefined) {
      throw { errorMessage: 'JWT Token not found', status: 401 };
    }
    const [prefix, token] = req.headers.authorization.split(' ');
    if (prefix !== 'Bearer' || typeof token !== 'string' || token.length < 10) {
      throw { errorMessage: 'Invalid JWT Token', status: 401 };
    }
    const decoded = jwt.verify(token, config.JWT_SECRET) as IUser;
    req.user = <IUser>decoded;
    next();
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.errorMessage });
  }
}
