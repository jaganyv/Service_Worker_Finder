import api from './axios'

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export interface BookingRequest {
  workerId: number
  date: string
  time: string
}

export interface BookingResponse {
  id: number
  workerId: number
  workerName: string
  workerPhone: string
  serviceType: string
  customerId: number
  customerName: string
  customerPhone: string
  date: string
  time: string
  status: BookingStatus
  createdAt: string
}

export const bookingsApi = {
  create: async (data: BookingRequest) => {
    const response = await api.post<BookingResponse>('/bookings', data)
    return response.data
  },
  getCustomerBookings: async () => {
    const response = await api.get<BookingResponse[]>('/bookings/customer')
    return response.data
  },
  getWorkerBookings: async () => {
    const response = await api.get<BookingResponse[]>('/bookings/worker')
    return response.data
  },
  updateStatus: async (id: number, status: BookingStatus) => {
    const response = await api.put<BookingResponse>(
      `/bookings/${id}/status`,
      null,
      { params: { status } }
    )
    return response.data
  },
}

