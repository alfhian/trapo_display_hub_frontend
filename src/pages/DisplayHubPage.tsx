// DisplayHubPage.tsx

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import 'sweetalert2/dist/sweetalert2.min.css'

// ✅ 1. IMPOR DARI FILE KONFIGURASI & UTILITAS
import { getServices } from '../config/services'
import { getEstimatedFinishDate } from '../utils/timeUtils'

type CardData = {
  customerName: string
  brand: string
  carType: string
  service: string
  licensePlate: string
  status: string
  time: string
} | null

function DisplayHubPage() {
  const [cards, setCards] = useState<CardData[]>([null, null, null, null])
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dashboardSlots')
    if (stored) setCards(JSON.parse(stored))
  }, [])

  const updateStorage = (updated: CardData[]) => {
    setCards(updated)
    localStorage.setItem('dashboardSlots', JSON.stringify(updated))
  }

  const handleDisplay = (
    index: number,
    formData: { customerName: string; brand: string; carType: string; service: string; licensePlate: string }
  ) => {
    // ✅ 2. GUNAKAN FUNSI UTILITAS BARU DAN FORMAT HASILNYA
    const estimatedDate = getEstimatedFinishDate(formData.service)
    const updated = [...cards]
    updated[index] = { ...formData, status: 'Active', time: estimatedDate.toLocaleString() }
    updateStorage(updated)
  }

  // ✅ Ganti handleRemove dengan SweetAlert2 konfirmasi
  const handleRemove = async (index: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear all customer data for this display slot.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#f68b8b',
      cancelButtonColor: '#d3d3d3',
      background: '#fff',
      color: '#333',
      backdrop: 'rgba(0, 0, 0, 0.25)',
      customClass: {
        popup: 'rounded-2xl shadow-lg',
        title: 'text-lg font-semibold text-gray-800',
        confirmButton: 'rounded-full px-5 py-2 font-medium',
        cancelButton: 'rounded-full px-5 py-2 font-medium',
      },
    })

    if (result.isConfirmed) {
      removeSlot(index)
      Swal.fire({
        title: 'Removed!',
        text: 'This slot has been cleared successfully.',
        icon: 'success',
        timer: 1300,
        showConfirmButton: false,
        background: '#fff',
        color: '#333',
      })
    }
  }

  const removeSlot = (index: number) => {
    const updated = [...cards]
    updated[index] = null
    updateStorage(updated)
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] relative">
      <Sidebar isHovered={isSidebarHovered} setIsHovered={setIsSidebarHovered} />
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 max-h-screen overflow-y-auto transition-all duration-300">
        <Navbar title="Display Hub" />

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-lg sm:text-xl font-bold text-gray-700">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {card ? (
                    <>
                      <CheckCircle className="text-green-500 h-5 sm:h-6 w-5 sm:w-6" />
                      <span className="text-green-600 font-semibold text-sm sm:text-base">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-400 h-5 sm:h-6 w-5 sm:w-6" />
                      <span className="text-red-500 font-semibold text-sm sm:text-base">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
              </div>

              <FormCard
                index={index}
                initialData={card}
                onDisplay={handleDisplay}
                onRemove={handleRemove}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function FormCard({
  index,
  initialData,
  onDisplay,
  onRemove,
}: {
  index: number
  initialData: CardData
  onDisplay: (index: number, formData: { customerName: string; brand: string; carType: string; service: string; licensePlate: string }) => void
  onRemove: (index: number) => void
}) {
  const [form, setForm] = useState({
    customerName: initialData?.customerName || '',
    brand: initialData?.brand || '',
    carType: initialData?.carType || '',
    service: initialData?.service || '',
    licensePlate: initialData?.licensePlate || '',
  })

  // ✅ 3. TAMBAHKAN STATE UNTUK MENYIMPAN DAFTAR LAYANAN
  const [services, setServices] = useState(getServices);

  useEffect(() => {
    if (initialData) {
      setForm({
        customerName: initialData.customerName,
        brand: initialData.brand,
        carType: initialData.carType,
        service: initialData.service,
        licensePlate: initialData.licensePlate,
      })
    } else {
      setForm({ customerName: '', brand: '', carType: '', service: '', licensePlate: '' })
    }
  }, [initialData])

  const isActive = !!initialData
  // ✅ 4. GUNAKAN FUNSI UTILITAS BARU UNTUK MENGHITUNG ESTIMASI
  const estimatedTime = form.service ? getEstimatedFinishDate(form.service).toLocaleString() : '-'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service) {
      alert('Silakan pilih jenis layanan terlebih dahulu.')
      return
    }
    if (isActive) onRemove(index)
    else onDisplay(index, form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-700">
      {[
        { label: 'Customer Name', name: 'customerName' },
        { label: 'Car Brand', name: 'brand' },
        { label: 'Type', name: 'carType' },
      ].map((field) => (
        <div key={field.name} className="flex items-center justify-between gap-6 py-1">
          <label className="w-36 sm:w-40 text-right font-semibold text-gray-800">
            {field.label}
          </label>
          <input
            type="text"
            name={field.name}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
            className={`flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${
              isActive
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'
            }`}
            disabled={isActive}
            required
          />
        </div>
      ))}

    <div className="flex items-center justify-between gap-6 py-1">
        <label className="w-36 sm:w-40 text-right font-semibold text-gray-800">License Plate</label>
        <input
          type="text"
          name="licensePlate"
          value={form.licensePlate}
          onChange={handleChange}
          className={`flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${
            isActive
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'
          }`}
           disabled={isActive}
          required
        />
      </div>

      <div className="flex items-center justify-between gap-6 py-1">
        <label className="w-36 sm:w-40 text-right font-semibold text-gray-800">Service</label>
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className={`flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${
            isActive
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'
          }`}
          disabled={isActive}
          required
        >
          <option value="">Pilih layanan</option>
          {/* ✅ 5. MAP DARI STATE services YANG SUDAH DIPERBAHARUI */}
          {services.map((service) => (
            <option key={service.value} value={service.value}>
              {service.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-6 py-1">
        <label className="w-36 sm:w-40 text-right font-semibold text-gray-800">Estimated Time</label>
        <input
          type="text"
          value={estimatedTime}
          disabled
          className="flex-1 border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`mt-5 px-8 sm:px-10 py-2.5 rounded-full text-sm sm:text-base font-semibold text-white transition-all duration-300 shadow-sm ${
            isActive
              ? 'bg-[#f68b8b] hover:bg-[#f57b7b]'
              : 'bg-[#7883ff] hover:bg-[#6a73e6]'
          }`}
        >
          {isActive ? 'Remove' : 'Display'}
        </button>
      </div>
    </form>
  )
}

export default DisplayHubPage