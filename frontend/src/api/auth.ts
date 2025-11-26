import api from './axios'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  lat?: number
  lon?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  email: string
  role: string
  userId: number
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },
  registerWorker: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register/worker', data)
    return response.data
  },
  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },
}

