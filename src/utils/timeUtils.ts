// src/utils/timeUtils.ts

// ✅ 1. GANTI IMPOR MENJADI getServices
import { getServices } from '../config/services';

/**
 * Menghitung estimasi waktu selesai berdasarkan nilai layanan.
 * @param serviceValue - Nilai layanan yang dipilih (dari form).
 * @returns Objek Date yang berisi waktu estimasi selesai.
 */
export const getEstimatedFinishDate = (serviceValue: string): Date => {
  // ✅ 2. GUNAKAN FUNSI getServices() UNTUK MENDAPATKAN DAFTAR TERKINI
  const services = getServices();
  
  // ✅ 3. CARI LAYANAN YANG COCOK DI DAFTAR TERKINI
  const service = services.find(s => s.value === serviceValue);

  if (service) {
    const now = new Date();
    // Tambahkan durasi dalam menit ke waktu sekarang
    return new Date(now.getTime() + service.durationMinutes * 60000);
  }

  // Jika layanan tidak ditemukan, kembalikan tanggal sekarang
  return new Date();
};