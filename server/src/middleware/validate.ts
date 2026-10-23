import type { NextFunction, Request, Response } from 'express'
import type { ZodTypeAny } from 'zod'

type ValidateTarget = 'body' | 'params' | 'query'

/**
 * Validates and parses the given part of the request, replacing it
 * with the parsed (and defaulted) value before calling the handler.
 */
export function validate(schema: ZodTypeAny, target: ValidateTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Thrown ZodError is converted by the central error handler.
    // Wrap in object form since schemas validate { body: ... } etc.
    const parsed = schema.safeParse({ [target]: req[target] })
    if (!parsed.success) {
      next(parsed.error)
      return
    }
    // Reassign parsed data (strips unknown keys, applies defaults)
    Object.assign(req, parsed.data)
    next()
  }
}
