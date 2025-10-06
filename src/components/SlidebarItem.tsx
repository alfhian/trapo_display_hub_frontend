type SidebarItemProps = {
  label: string
  active?: boolean
  icon: JSX.Element
}

const SidebarItem = ({ label, active = false, icon }: SidebarItemProps) => {
  return (
    <button
      className={`flex items-center space-x-4 px-4 py-2 text-left w-full rounded-lg transition-colors ${
        active
          ? 'bg-gray-700 text-white font-semibold'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default SidebarItem