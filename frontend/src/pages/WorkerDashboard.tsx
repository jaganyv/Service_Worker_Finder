import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingsApi, BookingResponse, BookingStatus } from '../api/bookings'
import { workersApi, WorkerResponse, ServiceType } from '../api/workers'
import { useAuth } from '../hooks/useAuth'

export default function WorkerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [worker, setWorker] = useState<WorkerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [registerData, setRegisterData] = useState({
    serviceType: ServiceType.ELECTRICIAN,
    experienceYears: 0,
    priceRange: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        const [bookingsData, workerData] = await Promise.all([
          bookingsApi.getWorkerBookings(),
          workersApi.getWorkerById(user.userId).catch(() => null),
        ])
        setBookings(bookingsData)
        setWorker(workerData)
        if (!workerData) {
          setShowRegisterForm(true)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await workersApi.register(registerData)
      window.location.reload()
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to register as worker')
    }
  }

  const handleStatusUpdate = async (bookingId: number, status: BookingStatus) => {
    try {
      await bookingsApi.updateStatus(bookingId, status)
      const updated = await bookingsApi.getWorkerBookings()
      setBookings(updated)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update status')
    }
  }

  const handleAvailabilityToggle = async () => {
    if (!worker) return
    try {
      await workersApi.updateAvailability(worker.id, !worker.availability)
      const updated = await workersApi.getWorkerById(worker.id)
      setWorker(updated)
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update availability')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (showRegisterForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Complete Your Worker Profile</h1>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={registerData.serviceType}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      serviceType: e.target.value as ServiceType,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(ServiceType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={registerData.experienceYears}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      experienceYears: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  placeholder="e.g., ₹500-₹2000"
                  value={registerData.priceRange}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, priceRange: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Register as Worker
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Worker Dashboard</h1>
          {worker && (
            <button
              onClick={handleAvailabilityToggle}
              className={`px-4 py-2 rounded-lg ${
                worker.availability
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {worker.availability ? 'Set Unavailable' : 'Set Available'}
            </button>
          )}
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-6">
          {worker && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
              <p>Service: {worker.serviceType}</p>
              <p>Rating: ⭐ {worker.rating.toFixed(1)}</p>
              <p>Status: {worker.availability ? 'Available' : 'Unavailable'}</p>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4">Bookings</h2>
        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{booking.customerName}</h3>
                    <p className="text-gray-600">Phone: {booking.customerPhone}</p>
                    <p className="text-gray-600">Date: {booking.date} at {booking.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === BookingStatus.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === BookingStatus.ACCEPTED
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                {booking.status === BookingStatus.PENDING && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, BookingStatus.ACCEPTED)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, BookingStatus.REJECTED)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

