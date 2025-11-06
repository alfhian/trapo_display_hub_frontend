import React from 'react'
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
import { useState, useEffect } from 'react'

interface SidebarProps {
  onWidthChange?: (width: number) => void
}

const Sidebar = ({ onWidthChange }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // 🔹 Update parent (DisplayHubPage) margin kiri sesuai lebar sidebar
  useEffect(() => {
    onWidthChange?.(isExpanded ? 256 : 80)
  }, [isExpanded, onWidthChange])

  return (
    <>
      {/* Sidebar utama */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col bg-[#111217] text-white 
                    border-r border-gray-800 shadow-[4px_0_25px_rgba(0,0,0,0.45)]
                    transition-all duration-300 ease-in-out z-40
                    ${isExpanded ? 'w-64' : 'w-20'}`}
      >
        {/* 🔹 Logo */}
        <div className="flex-shrink-0 flex flex-col items-center pt-10 pb-6">
          {isExpanded ? (
            <img
              src={logoTrapo}
              alt="Trapo Logo"
              className="h-8 w-auto mb-8 object-contain drop-shadow-[0_0_10px_rgba(56,71,209,0.35)]"
            />
          ) : (
            <div className="h-10 w-10 mb-8 rounded-full bg-[#3847D1] shadow-[0_0_15px_rgba(56,71,209,0.4)]" />
          )}
        </div>

        {/* 🔹 Menu scrollable */}
        <div className="flex-1 overflow-y-auto px-3 scrollbar-thin scrollbar-thumb-[#3847D1]/70 scrollbar-track-transparent hover:scrollbar-thumb-[#3847D1]">
          <nav className="space-y-2 pb-6">
            <SidebarLink
              to="/dashboard"
              label="Dashboard"
              icon={<GoGraph size={22} />}
              active={isActive('/dashboard')}
              isExpanded={isExpanded}
            />
            <SidebarLink
              to="/display-hub"
              label="Display Hub"
              icon={<GoDeviceDesktop size={22} />}
              active={isActive('/display-hub')}
              isExpanded={isExpanded}
            />

          </nav>
        </div>

        {/* 🔹 Bagian bawah (tetap di bawah) */}
        <div className="flex-shrink-0 border-t border-gray-700/40 px-3 pt-4 pb-6 space-y-2">
          <SidebarLink
            to="/settings"
            label="Settings"
            icon={<GoGear size={22} />}
            isExpanded={isExpanded}
          />
          <button onClick={handleLogout} className="w-full text-left">
            <SidebarItem
              label="Log Out"
              icon={<GoSignOut size={22} />}
              isExpanded={isExpanded}
            />
          </button>
        </div>
      </aside>

      {/* 🔹 Tombol toggle expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`fixed top-4 ${isExpanded ? 'left-64' : 'left-20'}
                    -translate-x-1/2 bg-[#1f2430] hover:bg-[#2d3342]
                    text-gray-200 rounded-full p-2 shadow-md transition-all duration-300 z-50`}
      >
        {isExpanded ? <GoChevronLeft size={16} /> : <GoChevronRight size={16} />}
      </button>
    </>
  )
}

/* -------------------- Subkomponen: Link Wrapper -------------------- */
const SidebarLink = ({
  to,
  label,
  icon,
  active,
  isExpanded,
}: {
  to: string
  label: string
  icon?: React.ReactNode
  active?: boolean
  isExpanded: boolean
}) => (
  <Link to={to}>
    <SidebarItem label={label} icon={icon} active={active} isExpanded={isExpanded} />
  </Link>
)

/* -------------------- Subkomponen: Item -------------------- */
const SidebarItem = ({
  label,
  icon,
  active = false,
  isExpanded,
}: {
  label: string
  icon?: React.ReactNode
  active?: boolean
  isExpanded: boolean
}) => {
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
