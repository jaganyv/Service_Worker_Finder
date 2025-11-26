import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { workersApi, ServiceType, WorkerResponse } from '../api/workers'
import WorkerCard from '../components/WorkerCard'
import MapView from '../components/MapView'

export default function WorkerList() {
  const [searchParams] = useSearchParams()
  const serviceParam = searchParams.get('service') as ServiceType | null
  const [workers, setWorkers] = useState<WorkerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        () => {
          console.log('Location access denied')
        }
      )
    }
  }, [])

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true)
      try {
        const params: any = {}
        if (serviceParam) {
          params.service = serviceParam
        }
        if (userLocation) {
          params.lat = userLocation.lat
          params.lon = userLocation.lon
          params.radius = 50
        }
        const data = await workersApi.getWorkers(params)
        setWorkers(data)
      } catch (error) {
        console.error('Failed to fetch workers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkers()
  }, [serviceParam, userLocation])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading workers...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          {serviceParam ? `${serviceParam}s` : 'All Workers'}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {workers.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">No workers found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            )}
          </div>
          <div className="sticky top-4 h-[600px]">
            <MapView workers={workers} />
          </div>
        </div>
      </div>
    </div>
  )
}

