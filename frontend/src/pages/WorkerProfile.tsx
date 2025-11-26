import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { workersApi, WorkerResponse } from '../api/workers'
import { useAuth } from '../hooks/useAuth'
import RatingDisplay from '../components/RatingDisplay'

export default function WorkerProfile() {
  const { id } = useParams<{ id: string }>()
  const [worker, setWorker] = useState<WorkerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchWorker = async () => {
      if (!id) return
      try {
        const data = await workersApi.getWorkerById(parseInt(id))
        setWorker(data)
      } catch (error) {
        console.error('Failed to fetch worker:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWorker()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Worker not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{worker.name}</h1>
              <p className="text-xl text-gray-600">{worker.serviceType}</p>
            </div>
            <RatingDisplay rating={worker.rating} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">Email: {worker.email}</p>
              <p className="text-gray-600">Phone: {worker.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Service Details</h3>
              {worker.experienceYears && (
                <p className="text-gray-600">
                  Experience: {worker.experienceYears} years
                </p>
              )}
              {worker.priceRange && (
                <p className="text-gray-600">Price Range: {worker.priceRange}</p>
              )}
              <p className="text-gray-600">
                Status:{' '}
                <span
                  className={
                    worker.availability
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
                  {worker.availability ? 'Available' : 'Unavailable'}
                </span>
              </p>
            </div>
          </div>

          {user && user.role === 'CUSTOMER' && worker.availability && (
            <div className="mt-6">
              <Link
                to={`/book/${worker.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
              >
                Book This Worker
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

