import type { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { env } from '../config/env'
import { HttpError } from './http-error'

export class ValidationError extends HttpError {
  constructor(public readonly fieldErrors: Record<string, string>) {
    super(422, 'Validation failed')
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // Express requires the 4-arity signature even when next is unused
  _next: NextFunction,
): void {
  // Known, intentional errors
  if (err instanceof HttpError) {
    const body: Record<string, unknown> = { message: err.message }
    if (err instanceof ValidationError) body.errors = err.fieldErrors
    res.status(err.status).json(body)
    return
  }

  // Zod validation errors -> 422 with field-level details
  if (err instanceof ZodError) {
    const errors: Record<string, string> = {}
    for (const issue of err.issues) {
      const key = issue.path.join('.') || '_'
      if (!(key in errors)) errors[key] = issue.message
    }
    res.status(422).json({ message: 'Validation failed', errors })
    return
  }

  // Prisma known errors (unique constraint / not found)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Model-agnostic: name the duplicated field generically instead of
      // assuming it is an email (only auth uses this today, but the handler
      // is shared).
      const target = (err.meta as { target?: string[] } | undefined)?.target
      const field = Array.isArray(target) ? target.join(', ') : 'field'
      res.status(409).json({ message: `A record with this ${field} already exists` })
      return
    }
    if (err.code === 'P2025') {
      res.status(404).json({ message: 'Resource not found' })
      return
    }
  }

  // Prisma cannot reach the database
  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error('[error] database connection failure:', err.message)
    res.status(503).json({ message: 'Database unavailable' })
    return
  }

  console.error('[error] unhandled:', err)
  const body: Record<string, unknown> = { message: 'Internal server error' }
  if (env.nodeEnv !== 'production' && err instanceof Error) {
    body.details = err.message
  }
  res.status(500).json(body)
}
