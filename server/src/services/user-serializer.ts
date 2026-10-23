import type { User } from '@prisma/client'

// Generic: safe-to-expose user shape shared by any module that returns users.
export type PublicUser = {
  id: string
  name: string
  email: string
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}
