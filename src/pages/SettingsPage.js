import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SettingsPage.tsx
import { useState } from 'react';
import { GoPlus, GoTrash } from 'react-icons/go';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getServices, saveServices } from '../config/services';
function SettingsPage() {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    // State untuk Nama Admin
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || 'Administrator');
    // State untuk Daftar Layanan
    const [services, setServices] = useState(getServices);
    // State untuk Form Tambah Layanan Baru
    const [newService, setNewService] = useState({
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
        const serviceToAdd = {
            ...newService,
            value: newService.label,
        };
        const updatedServices = [...services, serviceToAdd];
        setServices(updatedServices);
        setNewService({ label: '', durationMinutes: 60 });
    };
    // Fungsi untuk menghapus layanan
    const handleDeleteService = (indexToDelete) => {
        const updatedServices = services.filter((_, index) => index !== indexToDelete);
        setServices(updatedServices);
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-[#f5f5f5]", children: [_jsx(Sidebar, {}), _jsxs("main", { className: "flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 max-h-screen overflow-y-auto transition-all duration-300", children: [_jsx(Navbar, { title: "Settings" }), _jsxs("div", { className: "mt-8 sm:mt-10 grid grid-cols-1 gap-y-10", children: [_jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300", children: [_jsx("h2", { className: "text-xl font-bold mb-6", children: "User Settings" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 text-xs font-semibold mb-2", htmlFor: "username", children: "Display Name" }), _jsx("input", { id: "username", type: "text", value: userName, onChange: (e) => setUserName(e.target.value), className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 text-sm leading-tight focus:outline-none focus:shadow-outline" })] })] }), _jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300", children: [_jsx("h2", { className: "text-xl font-bold mb-6", children: "Manage Services" }), _jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-base font-semibold mb-4", children: "Current Services" }), services.length === 0 ? (_jsx("p", { className: "text-gray-500 text-sm", children: "No services configured." })) : (_jsx("div", { className: "space-y-2", children: services.map((service, index) => (_jsxs("div", { className: "flex justify-between items-center p-3 border rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-normal text-sm", children: service.label }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Duration: ", service.durationMinutes, " minutes"] })] }), _jsx("button", { onClick: () => handleDeleteService(index), className: "text-red-500 hover:text-red-700 p-2", title: "Delete Service", children: _jsx(GoTrash, { size: 18 }) })] }, index))) }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold mb-4", children: "Add New Service" }), _jsxs("div", { className: "flex gap-4 items-end", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-gray-700 text-xs font-semibold mb-2", children: "Service Name" }), _jsx("input", { type: "text", value: newService.label, onChange: (e) => setNewService({ ...newService, label: e.target.value }), className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 text-sm leading-tight focus:outline-none focus:shadow-outline", placeholder: "e.g., Ganti Oli Mesin" })] }), _jsxs("div", { className: "w-32", children: [_jsx("label", { className: "block text-gray-700 text-xs font-semibold mb-2", children: "Duration (min)" }), _jsx("input", { type: "number", value: newService.durationMinutes, onChange: (e) => setNewService({ ...newService, durationMinutes: parseInt(e.target.value) || 0 }), className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 text-sm leading-tight focus:outline-none focus:shadow-outline" })] }), _jsxs("button", { onClick: handleAddService, className: "bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 text-sm", children: [_jsx(GoPlus, { size: 18 }), " Add"] })] })] })] })] }), _jsx("div", { className: "flex justify-end mt-8", children: _jsx("button", { onClick: handleSaveSettings, className: "bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline text-sm", children: "Save All Changes" }) })] })] }));
}
export default SettingsPage;
