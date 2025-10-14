// src/components/DisplayCard.tsx

type DisplayCardProps = {
  number: number
  status: 'Active' | 'Inactive'
  name: string
  brand: string
  type: string
  service: string
  licensePlate: string // ✅ TAMBAHKAN PROPS INI
  time: string
  action: 'Remove' | 'Display'
}

const DisplayCard = ({
  number,
  status,
  name,
  brand,
  type,
  service,
  licensePlate, // ✅ TAMBAHKAN INI
  time,
  action,
}: DisplayCardProps) => {
  const isActive = status === 'Active'

  const statusColor = isActive ? 'text-green-600' : 'text-red-600'
  const statusIcon = isActive ? '✔' : '❌'

  const buttonStyle = isActive
    ? 'bg-red-600 text-white hover:bg-red-700'
    : 'border border-gray-400 text-gray-600 hover:bg-gray-100'

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3">
      {/* Header: Number + Status */}
      <div className="flex items-center gap-4 mb-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
          {number}
        </div>
        <span className={`font-semibold ${statusColor}`}>
          {statusIcon} {status}
        </span>
      </div>

      {/* Info Section */}
      <div className="space-y-1 text-sm text-gray-700">
        <p>Customer Name: {name}</p>
        <p>Car Brand: {brand}</p>
        <p>Type: {type}</p>
        <p>Service: {service}</p>
        <p>Licence Plate: {licensePlate}</p> {/* ✅ TAMBAHKAN BARIS INI */}
        <p>Estimated Time: {time}</p>
      </div>

      {/* Action Button */}
      <button className={`mt-4 px-4 py-2 rounded ${buttonStyle}`}>
        {action}
      </button>
    </div>
  )
}

export default DisplayCard