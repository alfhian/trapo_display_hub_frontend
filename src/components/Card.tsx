// src/components/Card.tsx
import StatusBadge from './StatusBadge'

type CardProps = {
  number: number
  status: 'Active' | 'Inactive'
  date: string
}

const Card = ({ number, status, date }: CardProps) => {
  const isActive = status === 'Active'

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
      {/* Number Circle */}
      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
        {number}
      </div>

      {/* Status Info */}
      <div className="flex flex-col">
        <span className={`font-semibold ${isActive ? 'text-green-600' : 'text-red-600'}`}>
          {isActive ? '✔ Active' : '❌ Inactive'}
        </span>
        <span className="text-sm text-gray-600">
          Est. Time: {isActive ? date : '-'}
        </span>
      </div>
    </div>
  )
}

export default Card
