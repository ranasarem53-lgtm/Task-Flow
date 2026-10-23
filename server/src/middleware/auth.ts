import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { HttpError } from './http-error'

export type AuthUser = { id: string; email: string }

export interface AuthRequest extends Request {
  user?: AuthUser
}



function extractToken(header: string | undefined): string {
  if (!header || !header.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing or invalid Authorization header')
  }
  return header.slice('Bearer '.length)
}

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const token = extractToken(req.headers.authorization)
    const payload = jwt.verify(token, env.jwtSecret)

    if (
      typeof payload === 'string' ||
      typeof (payload as { sub?: unknown }).sub !== 'string'
    ) {
      throw new HttpError(401, 'Invalid token payload')
    }

    const { sub, email } = payload as { sub: string; email?: string }
    req.user = { id: sub, email: email ?? '' }
    next()
  } catch (err) {
    if (err instanceof HttpError) {
      next(err)
      return
    }
    next(new HttpError(401, 'Invalid or expired token'))
  }
}
