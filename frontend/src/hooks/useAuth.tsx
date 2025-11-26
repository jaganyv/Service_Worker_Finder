import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, AuthResponse } from '../api/auth'

interface User {
  email: string
  role: string
  userId: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any, isWorker?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await authApi.login({ email, password })
    const userData: User = {
      email: response.email,
      role: response.role,
      userId: response.userId,
    }
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const register = async (data: any, isWorker = false) => {
    const response: AuthResponse = isWorker
      ? await authApi.registerWorker(data)
      : await authApi.register(data)
    const userData: User = {
      email: response.email,
      role: response.role,
      userId: response.userId,
    }
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

