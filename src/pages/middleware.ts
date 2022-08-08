import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../utils/constants.util';
import AppError from '../config/error.config';

function middleware(req: NextApiRequest) {
  const authorization: any = req.headers.authorization;
  const token = _parseToken(authorization);
  let payload: any = null;

  try {
    payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    throw new AppError(403, `Invalid token`, error);
  }

  return payload;
}

function _parseToken(header: string) {
  return header.replace('Bearer ', '').trim() ?? null;
}

export default middleware;
