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
    <aside className="bg-[#1E1E1E] text-white w-72 min-h-screen flex flex-col justify-between px-8 py-10 shadow-lg">
      {/* Logo Section */}
      <div>
        <div className="flex justify-center mb-7">
          <img
            src={logoTrapo}
            alt="Trapo Logo"
            className="h-32 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <Link to="/dashboard">
            <SidebarItem
              label="Dashboard"
              icon={<GoGraph size={24} />}
              active={isActive('/')}
            />
          </Link>
          <Link to="/display-hub">
            <SidebarItem
              label="Display Hub"
              icon={<GoDeviceDesktop size={24} />}
              active={isActive('/display-hub')}
            />
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-5 border-t border-gray-700">
        <SidebarItem label="Settings" icon={<GoGear size={22} />} />
        <SidebarItem label="Log Out" icon={<GoSignOut size={22} />} />
      </div>
    </aside>
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
      className={`flex items-center gap-4 w-full px-5 py-3 rounded-xl transition-all duration-300 text-[15px] font-medium tracking-wide ${
        active
          ? 'bg-[#364152] text-white font-semibold shadow-inner'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </button>
  )
}

export default Sidebar
