export type User = {
  id: string
  name: string
  email: string
}

// Shape returned by POST /api/auth/login and /api/auth/register
export type AuthResult = {
  user: User
  token: string
}
