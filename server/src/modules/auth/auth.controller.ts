import type { NextFunction, Request, Response } from 'express'
import { authService } from './auth.service'
import type { AuthResult } from './auth.service'

function sendAuth(res: Response, result: AuthResult): void {
  res.status(200).json(result)
}

export type { AuthResult }

export const authController = {
  // POST /api/auth/register
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body as {
        name: string
        email: string
        password: string
      }
      const result = await authService.register({ name, email, password })
      res.status(201).json(result)
      return
    } catch (err) {
      next(err)
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string }
      const result = await authService.login({ email, password })
      sendAuth(res, result)
      return
    } catch (err) {
      next(err)
    }
  },
}
