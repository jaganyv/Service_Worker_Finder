import ServiceCategoryCard from '../components/ServiceCategoryCard'
import { ServiceType } from '../api/workers'

const services = [
  { type: ServiceType.ELECTRICIAN, icon: '⚡', description: 'Electrical repairs and installations' },
  { type: ServiceType.PLUMBER, icon: '🔧', description: 'Plumbing services and fixes' },
  { type: ServiceType.CARPENTER, icon: '🪚', description: 'Woodwork and furniture' },
  { type: ServiceType.MECHANIC, icon: '🔩', description: 'Vehicle repairs and maintenance' },
  { type: ServiceType.TAILOR, icon: '✂️', description: 'Clothing alterations and tailoring' },
  { type: ServiceType.PAINTER, icon: '🎨', description: 'Painting and wall treatments' },
  { type: ServiceType.MASON, icon: '🧱', description: 'Construction and masonry work' },
  { type: ServiceType.GARDENER, icon: '🌳', description: 'Gardening and landscaping' },
  { type: ServiceType.CLEANER, icon: '🧹', description: 'Cleaning services' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Service Workers Near You
          </h1>
          <p className="text-xl text-gray-600">
            Connect with skilled professionals in your area
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCategoryCard
              key={service.type}
              serviceType={service.type}
              icon={service.icon}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

