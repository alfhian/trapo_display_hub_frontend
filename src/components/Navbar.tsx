// src/components/Navbar.tsx

import { useState, useEffect } from 'react';

type NavbarProps = {
  title: string;
};

function Navbar({ title }: NavbarProps) {
  // State untuk menyimpan nama pengguna
  const [userName, setUserName] = useState('Administrator');

  // useEffect untuk membaca dari localStorage saat komponen dimuat
  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{title}</h1>
      {/* Gunakan state userName */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, {userName}</span>
        {/* ... Avatar atau elemen lainnya */}
      </div>
    </header>
  );
}

export default Navbar;