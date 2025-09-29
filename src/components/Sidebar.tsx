// src/components/Sidebar.tsx

const Sidebar = () => {
  return (
    <aside className="w-64 bg-black text-white flex flex-col justify-between p-6">
      {/* Top Section */}
      <div>
        <div className="h-24 bg-gray-900 mb-8" /> {/* Logo / Profile Placeholder */}
        <nav className="space-y-4">
          <SidebarItem label="Dashboard" active />
          <SidebarItem label="Display Hub" />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <SidebarItem label="Settings" />
        <SidebarItem label="Log Out" />
      </div>
    </aside>
  )
}

type SidebarItemProps = {
  label: string
  active?: boolean
}

const SidebarItem = ({ label, active = false }: SidebarItemProps) => {
  return (
    <button
      className={`text-left w-full px-4 py-2 rounded ${
        active ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-800'
      }`}
    >
      {label}
    </button>
  )
}

export default Sidebar
