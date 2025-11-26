import { useEffect, useState } from 'react'
import { bookingsApi, BookingResponse, BookingStatus } from '../api/bookings'

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsApi.getCustomerBookings()
        setBookings(data)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACCEPTED:
        return 'bg-green-100 text-green-800'
      case BookingStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case BookingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
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
                    <h3 className="text-xl font-semibold">{booking.workerName}</h3>
                    <p className="text-gray-600">{booking.serviceType}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Date: {booking.date}</p>
                    <p className="text-gray-600">Time: {booking.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone: {booking.workerPhone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

