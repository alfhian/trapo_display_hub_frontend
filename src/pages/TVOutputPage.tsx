// src/pages/TVOutputPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import logoTrapo from '../assets/LOGO_TRAPO.png';

type CustomerData = {
  customerName: string;
  brand: string;
  carType: string;
  service: string;
  licensePlate: string;
  estimatedFinishTime: string;
};

function TVOutputPage() {
  const { screenId } = useParams<{ screenId: string }>();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          } else {
            setCustomerData(null); // Tidak ada data, tampilkan standby
          }
        } else if (response.status === 404) {
          setCustomerData(null); // Layar tidak ada data, tampilkan standby
        } else {
          throw new Error('Failed to fetch screen data.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-4xl">Loading...</div>
      </div>
    );
  }

  // --- Tampilan Error ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500">
        <div className="text-4xl">Error: {error}</div>
      </div>
    );
  }

  // --- Tampilan Standby (Jika tidak ada customer) ---
  if (!customerData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <img src={logoTrapo} alt="Trapo Logo" className="w-64 h-auto mb-8 opacity-80" />
        <h1 className="text-6xl font-bold mb-4">TRAPO</h1>
        <p className="text-2xl text-gray-400">Please Stand By</p>
        <div className="absolute bottom-10 text-gray-500">
          Screen ID: {screenId}
        </div>
      </div>
    );
  }

  // --- Tampilan Aktif (Jika ada customer) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl max-w-4xl w-full text-center">
        <h2 className="text-5xl font-bold mb-8 text-cyan-400">Now Serving</h2>
        
        <div className="grid grid-cols-2 gap-8 text-left text-3xl">
          <div>
            <p className="text-gray-400 mb-2">Customer Name</p>
            <p className="font-semibold">{customerData.customerName}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">License Plate</p>
            <p className="font-semibold">{customerData.licensePlate}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Car</p>
            <p className="font-semibold">{customerData.brand} - {customerData.carType}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Service</p>
            <p className="font-semibold">{customerData.service}</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-gray-400 text-xl">Estimated Finish</p>
          <p className="text-4xl font-bold text-green-400">{customerData.estimatedFinishTime}</p>
        </div>
      </div>
      <div className="absolute bottom-10 text-gray-500">
        Screen ID: {screenId}
      </div>
    </div>
  );
}

export default TVOutputPage;