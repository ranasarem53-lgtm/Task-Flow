import { createContext, useCallback, useEffect, useState } from 'react'
import type { User } from './types/auth-types'
import { APP_CONSTANTS } from '../../shared/constants/app'

const STORAGE_KEY = APP_CONSTANTS.STORAGE_KEYS.USER
const TOKEN_KEY = 'taskflow-token'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

type AuthContextValue = {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [user, token])

  const login = useCallback((nextUser: User, nextToken: string) => {
    setUser(nextUser)
    setToken(nextToken)
  }, [])
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
