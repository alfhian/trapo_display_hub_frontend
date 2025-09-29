// src/components/StatusBadge.tsx
type StatusBadgeProps = {
  status: 'Active' | 'Inactive'
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const color = status === 'Active' ? 'text-green-600' : 'text-red-600'
  const icon = status === 'Active' ? '✔️' : '❌'

  return <span className={`text-sm font-semibold ${color}`}>{icon} {status}</span>
}

export default StatusBadge
