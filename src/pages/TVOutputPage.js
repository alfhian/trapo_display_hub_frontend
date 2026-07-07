import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/TVOutputPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import logoTrapo from '../assets/LOGO_TRAPO.png';
function TVOutputPage() {
    const { screenId } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!screenId) {
            setError("Screen ID is missing.");
            setIsLoading(false);
            return;
        }
        const fetchCustomerData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                // Asumsikan ada endpoint GET untuk mengambil data layar spesifik
                const response = await fetch(`${import.meta.env.VITE_API_URL}/screens/${screenId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // Backend mungkin mengembalikan data customer atau null jika kosong
                    if (data && data.customerName) { // Contoh pengecekan
                        setCustomerData(data);
                    }
                    else {
                        setCustomerData(null); // Tidak ada data, tampilkan standby
                    }
                }
                else if (response.status === 404) {
                    setCustomerData(null); // Layar tidak ada data, tampilkan standby
                }
                else {
                    throw new Error('Failed to fetch screen data.');
                }
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchCustomerData();
        // Opsional: Polling untuk update data setiap beberapa detik
        const intervalId = setInterval(fetchCustomerData, 30000); // Cek setiap 30 detik
        return () => clearInterval(intervalId);
    }, [screenId]);
    // --- Tampilan Loading ---
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-black text-white", children: _jsx("div", { className: "text-4xl", children: "Loading..." }) }));
    }
    // --- Tampilan Error ---
    if (error) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-black text-red-500", children: _jsxs("div", { className: "text-4xl", children: ["Error: ", error] }) }));
    }
    // --- Tampilan Standby (Jika tidak ada customer) ---
    if (!customerData) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-black text-white", children: [_jsx("img", { src: logoTrapo, alt: "Trapo Logo", className: "w-64 h-auto mb-8 opacity-80" }), _jsx("h1", { className: "text-6xl font-bold mb-4", children: "TRAPO" }), _jsx("p", { className: "text-2xl text-gray-400", children: "Please Stand By" }), _jsxs("div", { className: "absolute bottom-10 text-gray-500", children: ["Screen ID: ", screenId] })] }));
    }
    // --- Tampilan Aktif (Jika ada customer) ---
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8", children: [_jsxs("div", { className: "bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl max-w-4xl w-full text-center", children: [_jsx("h2", { className: "text-5xl font-bold mb-8 text-cyan-400", children: "Now Serving" }), _jsxs("div", { className: "grid grid-cols-2 gap-8 text-left text-3xl", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 mb-2", children: "Customer Name" }), _jsx("p", { className: "font-semibold", children: customerData.customerName })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 mb-2", children: "License Plate" }), _jsx("p", { className: "font-semibold", children: customerData.licensePlate })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 mb-2", children: "Car" }), _jsxs("p", { className: "font-semibold", children: [customerData.brand, " - ", customerData.carType] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 mb-2", children: "Service" }), _jsx("p", { className: "font-semibold", children: customerData.service })] })] }), _jsxs("div", { className: "mt-8 pt-8 border-t border-white/20", children: [_jsx("p", { className: "text-gray-400 text-xl", children: "Estimated Finish" }), _jsx("p", { className: "text-4xl font-bold text-green-400", children: customerData.estimatedFinishTime })] })] }), _jsxs("div", { className: "absolute bottom-10 text-gray-500", children: ["Screen ID: ", screenId] })] }));
}
export default TVOutputPage;
