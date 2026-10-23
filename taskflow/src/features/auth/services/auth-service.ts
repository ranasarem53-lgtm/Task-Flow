import { apiClient } from '../../../shared/api/api-client'
import type { AuthResult } from '../types/auth-types'

const LOGIN_ENDPOINT = '/auth/login'

export const authService = {
  // POST /api/auth/login -> { user, token }
  async login(email: string, password: string): Promise<AuthResult> {
    return apiClient<AuthResult>(LOGIN_ENDPOINT, {
      method: 'POST',
      body: { email, password },
    })
  },
}
