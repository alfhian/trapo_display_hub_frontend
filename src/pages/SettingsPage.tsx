// src/pages/SettingsPage.tsx

import { useState, useEffect } from 'react';
import { GoPlus, GoTrash } from 'react-icons/go';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getServices, saveServices, type ServiceConfig } from '../config/services';

function SettingsPage() {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // State untuk Nama Admin
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Administrator');

  // State untuk Daftar Layanan
  const [services, setServices] = useState<ServiceConfig[]>(getServices);

  // State untuk Form Tambah Layanan Baru
  const [newService, setNewService] = useState<Omit<ServiceConfig, 'value'>>({
    label: '',
    durationMinutes: 60,
  });

  // Fungsi untuk menyimpan semua pengaturan
  const handleSaveSettings = () => {
    localStorage.setItem('userName', userName);
    saveServices(services);
    alert('Settings saved successfully!');
  };

  // Fungsi untuk menambah layanan baru
  const handleAddService = () => {
    if (!newService.label.trim()) {
      alert('Service name cannot be empty.');
      return;
    }
    const serviceToAdd: ServiceConfig = {
      ...newService,
      value: newService.label,
    };
    const updatedServices = [...services, serviceToAdd];
    setServices(updatedServices);
    setNewService({ label: '', durationMinutes: 60 });
  };

  // Fungsi untuk menghapus layanan
  const handleDeleteService = (indexToDelete: number) => {
    const updatedServices = services.filter((_, index) => index !== indexToDelete);
    setServices(updatedServices);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar />
      
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 max-h-screen overflow-y-auto transition-all duration-300">
        <Navbar title="Settings" />
        
        {/* ✅ 1. GUNAKAN STRUKTUR GRID YANG SAMA DENGAN HALAMAN LAIN */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-y-10">
          
          {/* --- Bagian Pengaturan Nama Admin --- */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
            {/* ✅ 2. KECILKAN UKURAN FONT JUDUL */}
            <h2 className="text-xl font-bold mb-6">User Settings</h2>
            <div className="mb-4">
              {/* ✅ 3. KECILKAN UKURAN FONT LABEL */}
              <label className="block text-gray-700 text-xs font-semibold mb-2" htmlFor="username">
                Display Name
              </label>
              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 text-sm leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          {/* --- Bagian Manajemen Layanan --- */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
            {/* ✅ 2. KECILKAN UKURAN FONT JUDUL */}
            <h2 className="text-xl font-bold mb-6">Manage Services</h2>
            
            {/* Daftar Layanan Saat Ini */}
            <div className="mb-8">
              {/* ✅ 2. KECILKAN UKURAN FONT SUB-JUDUL */}
              <h3 className="text-base font-semibold mb-4">Current Services</h3>
              {services.length === 0 ? (
                <p className="text-gray-500 text-sm">No services configured.</p>
              ) : (
                <div className="space-y-2">
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        {/* ✅ 4. KECILKAN UKURAN FONT TEKS */}
                        <p className="font-normal text-sm">{service.label}</p>
                        <p className="text-xs text-gray-500">Duration: {service.durationMinutes} minutes</p>
                      </div>
                      <button
                        onClick={() => handleDeleteService(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Delete Service"
                      >
                        <GoTrash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Tambah Layanan Baru */}
            <div>
              {/* ✅ 2. KECILKAN UKURAN FONT SUB-JUDUL */}
              <h3 className="text-base font-semibold mb-4">Add New Service</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  {/* ✅ 3. KECILKAN UKURAN FONT LABEL */}
                  <label className="block text-gray-700 text-xs font-semibold mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={newService.label}
                    onChange={(e) => setNewService({ ...newService, label: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 text-sm leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g., Ganti Oli Mesin"
                  />
                </div>
                <div className="w-32">
                  {/* ✅ 3. KECILKAN UKURAN FONT LABEL */}
                  <label className="block text-gray-700 text-xs font-semibold mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={newService.durationMinutes}
                    onChange={(e) => setNewService({ ...newService, durationMinutes: parseInt(e.target.value) || 0 })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 text-sm leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <button
                  onClick={handleAddService}
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 text-sm"
                >
                  <GoPlus size={18} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline text-sm"
          >
            Save All Changes
          </button>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;