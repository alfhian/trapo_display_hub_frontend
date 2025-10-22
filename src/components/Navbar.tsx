// src/components/Navbar.tsx
import React from 'react';
import { FaUserCircle, FaCarSide } from 'react-icons/fa';
import { useState, useEffect } from 'react';

type NavbarProps = {
  title: string;
};

function Navbar({ title }: NavbarProps) {
  const [userName, setUserName] = useState('Administrator');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <header className="bg-transparent shadow-lg border-b border-gray-200 w-full py-5.5 px-6 flex justify-between items-center relative overflow-hidden">
      {/* Efek gradien di bagian bawah navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3847d1] via-[#45f3ff] to-[#d63384]"></div>
      
      {/* MOBIL PERTAMA (Polisi) */}
      <div className="car-animation">
        <FaCarSide className="car-icon police-icon" />
      </div>
      <div className="car-trail"></div>

      {/* MOBIL KEDUA (Maling) */}
      <div className="car-animation-2">
        <FaCarSide className="car-icon thief-icon" />
      </div>
      <div className="car-trail-2"></div>
      
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 drop-shadow-[0_0_10px_rgba(69,243,255,0.5)] font-['Poppins']">{title}</h1>
      
      <div className="flex items-center gap-4 relative z-10">
        <FaUserCircle className="text-3xl text-[#3847d1] drop-shadow-[0_0_8px_rgba(56,71,209,0.5)]" />
        <span className="text-gray-600 font-medium font-['Poppins']">Welcome, <span className="text-gray-800 font-semibold">{userName}</span></span>
      </div>
    </header>
  );
}

export default Navbar;