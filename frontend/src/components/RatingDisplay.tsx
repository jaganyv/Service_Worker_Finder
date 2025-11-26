interface RatingDisplayProps {
  rating: number
  maxRating?: number
}

export default function RatingDisplay({
  rating,
  maxRating = 5,
}: RatingDisplayProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        if (index < fullStars) {
          return <span key={index} className="text-yellow-500">★</span>
        } else if (index === fullStars && hasHalfStar) {
          return <span key={index} className="text-yellow-500">☆</span>
        } else {
          return <span key={index} className="text-gray-300">★</span>
        }
      })}
      <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
    </div>
  )
}

