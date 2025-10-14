// src/config/services.ts

export type ServiceConfig = {
  label: string;
  value: string;
  durationMinutes: number;
};

// Daftar layanan default jika tidak ada konfigurasi kustom
const DEFAULT_SERVICES: ServiceConfig[] = [
  { label: 'Instalasi Carmat', value: 'Instalasi Carmat', durationMinutes: 30 },
  { label: 'Instalasi Dashcam', value: 'Instalasi Dashcam', durationMinutes: 60 },
  { label: 'Coating Quick Shield', value: 'Coating Quick Shield', durationMinutes: 1440 },
  { label: 'Coating Pro', value: 'Coating Pro', durationMinutes: 4320 },
  { label: 'Coating Diamond', value: 'Coating Diamond', durationMinutes: 4320 },
  { label: 'PPF', value: 'PPF', durationMinutes: 10080 },
  { label: 'Interior Cleaning/Detailing', value: 'Interior Cleaning/Detailing', durationMinutes: 180 },
  { label: 'Pemasangan Kaca Film', value: 'Instal Kaca Film', durationMinutes: 120 },
];

/**
 * Fungsi untuk mendapatkan daftar layanan.
 * Mencoba membaca dari localStorage, jika tidak ada, mengembalikan daftar default.
 */
export const getServices = (): ServiceConfig[] => {
  try {
    const customServices = localStorage.getItem('customServices');
    if (customServices) {
      return JSON.parse(customServices);
    }
  } catch (error) {
    console.error("Failed to load custom services from localStorage:", error);
  }
  // Kembalikan default jika tidak ada yang disimpan atau terjadi error
  return DEFAULT_SERVICES;
};

/**
 * Fungsi untuk menyimpan daftar layanan ke localStorage.
 */
export const saveServices = (services: ServiceConfig[]) => {
  localStorage.setItem('customServices', JSON.stringify(services));
};