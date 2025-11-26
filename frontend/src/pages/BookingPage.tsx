import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingsApi } from '../api/bookings'
import { workersApi, WorkerResponse } from '../api/workers'

export default function BookingPage() {
  const { workerId } = useParams<{ workerId: string }>()
  const navigate = useNavigate()
  const [worker, setWorker] = useState<WorkerResponse | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId) return
      try {
        const data = await workersApi.getWorkerById(parseInt(workerId))
        setWorker(data)
      } catch (error) {
        console.error('Failed to fetch worker:', error)
      }
    }
    fetchWorker()
  }, [workerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workerId) return

    setLoading(true)
    setError('')
    try {
      await bookingsApi.create({
        workerId: parseInt(workerId),
        date,
        time,
      })
      navigate('/dashboard/customer')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Get tomorrow's date as minimum
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Book a Service</h1>
          {worker && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold">{worker.name}</h2>
              <p className="text-gray-600">{worker.serviceType}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                required
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                id="time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

