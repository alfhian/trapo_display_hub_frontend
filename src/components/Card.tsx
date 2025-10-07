import { useEffect, useState } from 'react'

type CardProps = {
  number: number
  status: 'Active' | 'Inactive'
  date: string
}

const Card = ({ number, status, date }: CardProps) => {
  const isActive = status === 'Active'
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timeout = setTimeout(() => setAnimate(false), 600)
    return () => clearTimeout(timeout)
  }, [status])

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md flex items-center gap-4 transition-all duration-500 ease-out ${
        animate ? 'scale-[1.02] shadow-lg' : ''
      }`}
    >
      {/* Number Circle */}
      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
        {number}
      </div>

      {/* Status Info */}
      <div className="flex flex-col transition-colors duration-300">
        <span
          className={`font-semibold transition-colors duration-300 ${
            isActive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isActive ? '✔ Active' : '❌ Inactive'}
        </span>
        <span className="text-sm text-gray-600">
          Estimated Time: {isActive ? date : '-'}
        </span>
      </div>
    </div>
  )
}

export default Card
