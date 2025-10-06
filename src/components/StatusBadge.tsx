// src/components/StatusBadge.tsx
type StatusBadgeProps = {
  status: 'Active' | 'Inactive'
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const isActive = status === 'Active'
  const color = isActive ? 'text-green-600' : 'text-red-600'
  const icon = isActive ? '✔️' : '❌'

  return (
    <span className={`text-sm font-semibold ${color}`}>
      {icon} {status}
    </span>
  )
}

export default StatusBadge
