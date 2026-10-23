import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma'
import { env } from '../../config/env'
import { HttpError } from '../../middleware/http-error'
import { toPublicUser, type PublicUser } from '../../services/user-serializer'
import type { User } from '@prisma/client'

const BCRYPT_ROUNDS = 10

type Credentials = { name?: string; email: string; password: string }

export type AuthResult = { user: PublicUser; token: string }

function issueToken(user: User): string {
  return jwt.sign(
    { sub: user.id, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] },
  )
}

export const authService = {
  async register({ name, email, password }: Credentials): Promise<AuthResult> {
    const emailTaken = await prisma.user.findUnique({ where: { email } })
    if (emailTaken) {
      throw new HttpError(409, 'Email is already registered')
    }

    // Hashing happens here, server-side; plain passwords are never stored.
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    const user = await prisma.user.create({
      data: { name: name ?? email.split('@')[0], email, password: passwordHash },
    })

    return { user: toPublicUser(user), token: issueToken(user) }
  },

  async login({ email, password }: Credentials): Promise<AuthResult> {
    const user = await prisma.user.findUnique({ where: { email } })

    // Same generic message for unknown email and wrong password
    // so we don't leak which accounts exist.
    if (!user) {
      // Burn comparable time so response timing doesn't reveal existence.
      await bcrypt.compare(password, '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv')
      throw new HttpError(401, 'Invalid email or password')
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      throw new HttpError(401, 'Invalid email or password')
    }

    return { user: toPublicUser(user), token: issueToken(user) }
  },
}
