// src/components/Sidebar.tsx

import logoTrapo from '../assets/LOGO_TRAPO.png'
import {
  GoGraph,
  GoDeviceDesktop,
  GoGear,
  GoSignOut,
} from 'react-icons/go'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react' // ✅ IMPOR useState

// ✅ TAMBAHKAN PROPS isHovered DAN setIsHovered
type SidebarProps = {
  isHovered: boolean
  setIsHovered: (hovered: boolean) => void
}

const Sidebar = ({ isHovered, setIsHovered }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  // ✅ FUNGSI UNTUK LOG OUT
  const handleLogout = () => {
    // Contoh: Hapus token autentikasi dari localStorage
    localStorage.removeItem('authToken') // Sesuaikan dengan key yang Anda gunakan
    localStorage.removeItem('user') // Jika ada data user

    // Arahkan pengguna ke halaman login
    navigate('/login'); // Ganti dengan route login Anda
  }

  return (
    // ✅ TAMBAHKAN onMouseEnter, onMouseLeave, DAN KELAS DINAMIS
    <aside
      className={`bg-[#1E1E1E] text-white min-h-screen flex flex-col justify-between shadow-lg transition-all duration-300 ease-in-out ${
        isHovered ? 'w-72 px-8' : 'w-16 px-2'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div>
        <div className="flex justify-center mb-7">
          {/* ✅ LOGO HANYA MUNCUL SAAT HOVER */}
          {isHovered && (
            <img
              src={logoTrapo}
              alt="Trapo Logo"
              className="h-52 w-auto object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          <Link to="/dashboard">
            <SidebarItem
              label="Dashboard"
              icon={<GoGraph size={30} />}
              active={isActive('/')}
              isHovered={isHovered} // ✅ LEWATKAN PROPS
            />
          </Link>
          <Link to="/display-hub">
            <SidebarItem
              label="Display Hub"
              icon={<GoDeviceDesktop size={30} />}
              active={isActive('/display-hub')}
              isHovered={isHovered} // ✅ LEWATKAN PROPS
            />
          </Link>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3 pt-5 border-t border-gray-700">
        <Link to="/settings">
        <SidebarItem label="Settings" icon={<GoGear size={28} />} isHovered={isHovered} />
        </Link>
        {/* ✅ TAMBAHKAN onClick KE LOG OUT BUTTON */}
        <button onClick={handleLogout} className="w-full">
          <SidebarItem label="Log Out" icon={<GoSignOut size={28} />} isHovered={isHovered} />
        </button>
      </div>
    </aside>
  )
}

// ✅ TAMBAHKAN isHovered KE PROPS SidebarItem
type SidebarItemProps = {
  label: string
  icon?: React.ReactNode
  active?: boolean
  isHovered: boolean
}

const SidebarItem = ({ label, icon, active = false, isHovered }: SidebarItemProps) => {
  return (
    <button
      className={`flex items-center gap-4 w-full px-2 py-4 rounded-xl transition-all duration-300 text-[15px] font-medium tracking-wide overflow-hidden ${
        active
          ? 'bg-[#364152] text-white font-semibold shadow-inner'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon && <span className="text-lg flex-shrink-0">{icon}</span>}
      {/* ✅ TEKS HANYA MUNCUL SAAT HOVER DENGAN EFEK TRANSISI */}
      <span
        className={`transition-all duration-300 whitespace-nowrap ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

export default Sidebar