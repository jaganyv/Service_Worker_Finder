import api from './axios'

export enum ServiceType {
  ELECTRICIAN = 'ELECTRICIAN',
  PLUMBER = 'PLUMBER',
  CARPENTER = 'CARPENTER',
  MECHANIC = 'MECHANIC',
  TAILOR = 'TAILOR',
  PAINTER = 'PAINTER',
  MASON = 'MASON',
  GARDENER = 'GARDENER',
  CLEANER = 'CLEANER',
  OTHER = 'OTHER',
}

export interface WorkerResponse {
  id: number
  name: string
  email: string
  phone: string
  serviceType: ServiceType
  experienceYears?: number
  priceRange?: string
  rating: number
  availability: boolean
  lat?: number
  lon?: number
  distance?: number
}

export interface WorkerRegisterRequest {
  serviceType: ServiceType
  experienceYears?: number
  priceRange?: string
}

export const workersApi = {
  register: async (data: WorkerRegisterRequest) => {
    const response = await api.post('/workers/register', data)
    return response.data
  },
  getWorkers: async (params?: {
    service?: ServiceType
    lat?: number
    lon?: number
    radius?: number
  }) => {
    const response = await api.get<WorkerResponse[]>('/workers', { params })
    return response.data
  },
  getWorkerById: async (id: number) => {
    const response = await api.get<WorkerResponse>(`/workers/${id}`)
    return response.data
  },
  updateAvailability: async (id: number, availability: boolean) => {
    const response = await api.put(`/workers/${id}/availability`, null, {
      params: { availability },
    })
    return response.data
  },
}

