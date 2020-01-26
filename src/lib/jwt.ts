import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import { Next } from 'koa';
import User from '../models/User';

const secret: any = process.env.JWT_SECRET;

export const generateToken = (payload: object): Promise<string> =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: '3d' }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });

const decodeToken = (token: string): any => jwt.verify(token, secret);

export const jwtMiddleware = async (ctx: any, next: Next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();

  try {
    const decoded = decodeToken(token);
    const { id } = decoded;

    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      const freshToken: any = await generateToken({ id });

      ctx.cookies.set('access_token', freshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
      });
    }

    ctx.request.user = await User.findOne({ where: { id } });
  } catch (e) {
    ctx.throw(500, e);
  }

  return next();
};
