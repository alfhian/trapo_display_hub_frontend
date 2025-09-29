// src/components/Card.tsx
import StatusBadge from './StatusBadge'

type CardProps = {
  status: 'Active' | 'Inactive'
  date: string
  number: number
}

const Card = ({ status, date, number }: CardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-2">
      <div className="text-2xl font-bold text-gray-400">{number}</div>
      <StatusBadge status={status} />
      <p className="text-sm text-gray-600">Est. Time: {date}</p>
    </div>
  )
}

export default Card
