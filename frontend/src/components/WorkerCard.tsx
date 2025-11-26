import { Link } from 'react-router-dom'
import { WorkerResponse } from '../api/workers'

interface WorkerCardProps {
  worker: WorkerResponse
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold">{worker.name}</h3>
          <p className="text-gray-600">{worker.serviceType}</p>
        </div>
        <div className="text-right">
          <div className="text-yellow-500 font-bold">
            ⭐ {worker.rating.toFixed(1)}
          </div>
          {worker.distance && (
            <div className="text-sm text-gray-500">
              {worker.distance.toFixed(1)} km away
            </div>
          )}
        </div>
      </div>
      <div className="mb-3">
        {worker.experienceYears && (
          <p className="text-sm text-gray-600">
            Experience: {worker.experienceYears} years
          </p>
        )}
        {worker.priceRange && (
          <p className="text-sm text-gray-600">Price: {worker.priceRange}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            worker.availability
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {worker.availability ? 'Available' : 'Unavailable'}
        </span>
        <Link
          to={`/workers/${worker.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}

