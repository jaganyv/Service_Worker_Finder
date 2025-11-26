import { Link } from 'react-router-dom'
import { ServiceType } from '../api/workers'

interface ServiceCategoryCardProps {
  serviceType: ServiceType
  icon: string
  description: string
}

export default function ServiceCategoryCard({
  serviceType,
  icon,
  description,
}: ServiceCategoryCardProps) {
  return (
    <Link
      to={`/workers?service=${serviceType}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{serviceType}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}

