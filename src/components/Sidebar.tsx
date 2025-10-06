// src/components/Sidebar.tsx

import logoTrapo from '../assets/LOGO_TRAPO.png'
import {
  GoGraph,
  GoDeviceDesktop,
  GoGear,
  GoSignOut,
} from 'react-icons/go'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()

const isActive = (path: string) => location.pathname === path


  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col justify-between px-4 py-6">
      <div>
        <div className="flex justify-center mb-8">
          <img src={logoTrapo} alt="Trapo Logo" className="h-16 w-auto" />
        </div>
        <nav className="space-y-4">
          <Link to="/">
            <SidebarItem label="Dashboard" icon={<GoGraph />} active={isActive('/')} />
          </Link>
          <Link to="/display-hub">
            <SidebarItem label="Display Hub" icon={<GoDeviceDesktop />} active={isActive('/display-hub')} />
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2">
        <SidebarItem label="Settings" icon={<GoGear />} />
        <SidebarItem label="Log Out" icon={<GoSignOut />} />
      </div>
    </div>
  )
}

type SidebarItemProps = {
  label: string
  icon?: React.ReactNode
  active?: boolean
}
const SidebarItem = ({ label, icon, active = false }: SidebarItemProps) => {
  return (
    <button
      className={`flex items-center gap-3 text-left w-full px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-gray-700 text-white font-semibold'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )
}

export default Sidebar
