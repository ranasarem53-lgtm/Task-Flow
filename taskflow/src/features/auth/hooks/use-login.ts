import { useState } from 'react'
import { authService } from '../services/auth-service'

export function useLogin() {
  const [loading, setLoading] = useState(false)

  async function login(email: string, password: string) {
    setLoading(true)

    try {
      const result = await authService.login(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  return {
    login,
    loading,
  }
}
