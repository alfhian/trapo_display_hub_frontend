import logoTrapo from '../assets/LOGO_TRAPO.png'
import {
  GoGraph,
  GoDeviceDesktop,
  GoGear,
  GoSignOut,
  GoChevronLeft,
  GoChevronRight,
} from 'react-icons/go'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="relative flex">
      {/* Sidebar */}
      <aside
        className={`min-h-screen flex flex-col justify-between
                    bg-[#111217] text-white border-r border-gray-800
                    shadow-[4px_0_25px_rgba(0,0,0,0.45)]
                    transition-all duration-300 ease-in-out
                    ${isExpanded ? 'w-64 px-6' : 'w-20 px-2'}`}
      >
        {/* Logo Section */}
        <div className="pt-10 flex flex-col items-center">
          {isExpanded ? (
            <img
              src={logoTrapo}
              alt="Trapo Logo"
              className="h-16 w-auto mb-10 object-contain drop-shadow-[0_0_10px_rgba(56,71,209,0.35)]"
            />
          ) : (
            <div className="h-10 w-10 mb-10 rounded-full bg-[#3847D1] shadow-[0_0_15px_rgba(56,71,209,0.4)]" />
          )}

          {/* Navigation */}
          <nav className="w-full space-y-2">
            <Link to="/dashboard">
              <SidebarItem
                label="Dashboard"
                icon={<GoGraph size={24} />}
                active={isActive('/dashboard')}
                isExpanded={isExpanded}
              />
            </Link>
            <Link to="/display-hub">
              <SidebarItem
                label="Display Hub"
                icon={<GoDeviceDesktop size={24} />}
                active={isActive('/display-hub')}
                isExpanded={isExpanded}
              />
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2 pb-6 border-t border-gray-700/40 pt-4">
          <Link to="/settings">
            <SidebarItem
              label="Settings"
              icon={<GoGear size={22} />}
              isExpanded={isExpanded}
            />
          </Link>
          <button onClick={handleLogout} className="w-full text-left">
            <SidebarItem
              label="Log Out"
              icon={<GoSignOut size={22} />}
              isExpanded={isExpanded}
            />
          </button>
        </div>
      </aside>

      {/* Floating Toggle Button (outside sidebar) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-4 ${isExpanded ? 'left-63' : 'left-20'}
                  -translate-x-1/2 bg-[#1f2430] hover:bg-[#2d3342]
                  text-gray-200 rounded-full p-2 shadow-md transition-all
                  z-50`}
      >
        {isExpanded ? <GoChevronLeft size={16} /> : <GoChevronRight size={16} />}
      </button>
    </div>
  )
}

type SidebarItemProps = {
  label: string
  icon?: React.ReactNode
  active?: boolean
  isExpanded: boolean
}

const SidebarItem = ({ label, icon, active = false, isExpanded }: SidebarItemProps) => {
  return (
    <div
      className={`flex items-center gap-4 w-full px-3 py-3 rounded-lg cursor-pointer
                  transition-all duration-300 text-[15px] font-medium relative
                  ${
                    active
                      ? 'bg-[#1B1C24] text-white'
                      : 'text-gray-400 hover:bg-[#1a1b22] hover:text-gray-100'
                  }`}
    >
      {/* Accent bar for active */}
      {active && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[rgba(238,42,123,1)] rounded-r-lg" />
      )}

      <span
        className={`flex-shrink-0 ${
          active ? 'text-[#3847D1]' : 'text-gray-400'
        } transition-colors duration-200`}
      >
        {icon}
      </span>

      <span
        className={`transition-all duration-300 whitespace-nowrap ${
          isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export default Sidebar
