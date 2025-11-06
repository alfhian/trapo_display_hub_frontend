import React, { useState, useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'

type NavbarProps = { title: string }

const Navbar = ({ title }: NavbarProps) => {
  const [userName, setUserName] = useState('Administrator')

  useEffect(() => {
    const n = localStorage.getItem('userName')
    if (n) setUserName(n)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 w-full h-[48px] flex justify-between items-center
                 px-5 bg-white/90 backdrop-blur-md border-b border-gray-200"
    >
      <h4 className="text-[25px] font-medium text-gray-800">{title}</h4>

      <div className="flex items-center gap-2">
        <FaUserCircle className="text-lg text-gray-600" />
        <span className="text-sm text-gray-700">
          <span className="text-gray-500">Welcome, </span>
          <span className="font-medium text-gray-900">{userName}</span>
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-100" />
    </header>
  )
}

export default Navbar
