import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { WorkerResponse } from '../api/workers'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapViewProps {
  workers: WorkerResponse[]
}

export default function MapView({ workers }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current && workers.length > 0) {
      const bounds = L.latLngBounds(
        workers
          .filter((w) => w.lat && w.lon)
          .map((w) => [w.lat!, w.lon!])
      )
      mapRef.current.fitBounds(bounds)
    }
  }, [workers])

  const defaultCenter: [number, number] = [28.6139, 77.209] // Default to Delhi

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {workers
          .filter((worker) => worker.lat && worker.lon)
          .map((worker) => (
            <Marker
              key={worker.id}
              position={[worker.lat!, worker.lon!]}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{worker.name}</h3>
                  <p>{worker.serviceType}</p>
                  {worker.distance && (
                    <p className="text-sm text-gray-600">
                      {worker.distance.toFixed(1)} km away
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}

