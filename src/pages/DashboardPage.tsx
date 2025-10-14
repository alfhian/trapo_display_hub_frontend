// DashboardPage.tsx

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import TVDisplayCard from '../components/TVDisplayCard'
import Swal from 'sweetalert2' // ✅ IMPOR SWEETALERT2
import 'sweetalert2/dist/sweetalert2.min.css' // ✅ IMPOR CSS SWEETALERT2

// Tipe CardData sudah lengkap
type CardData = {
  customerName: string
  brand: string
  carType: string
  service: string
  licensePlate: string
  status: string
  time: string
} | null

function DashboardPage() {
  const [cards, setCards] = useState<CardData[]>([null, null, null, null])

  useEffect(() => {
    const stored = localStorage.getItem('dashboardSlots')
    if (stored) setCards(JSON.parse(stored))
  }, [])

  const updateStorage = (updated: CardData[]) => {
    setCards(updated)
    localStorage.setItem('dashboardSlots', JSON.stringify(updated))
  }

  // ✅ UBAH FUNGSI INI MENJADI async DAN TAMBAHKAN KONFIRMASI
  const handleRemoveFromDisplay = async (index: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will clear the display and remove all customer data from this slot.',
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
      const updated = [...cards]
      updated[index] = null
      updateStorage(updated)
      Swal.fire({
        title: 'Removed!',
        text: 'The display slot has been cleared.',
        icon: 'success',
        timer: 1300,
        showConfirmButton: false,
        background: '#fff',
        color: '#333',
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <div className="w-60 md:w-64">
        <Sidebar />
      </div>

      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 max-h-screen overflow-y-auto transition-all duration-300">
        <Navbar title="Dashboard" />

        {/* Area Status Cards (tidak berubah) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-8"
            >
              <Card
                number={i + 1}
                status={cards[i]?.status === 'Active' ? 'Active' : 'Inactive'}
                date={cards[i]?.time || '-'}
              />
            </div>
          ))}
        </div>

        {/* Grid Layar TV */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-10">
          {cards.map((card, index) => (
            <TVDisplayCard 
              key={index} 
              data={card} 
              index={index} 
              onRemove={handleRemoveFromDisplay} // ✅ LEWATKAN FUNGSI YANG SUDAH DIPERBAIKI
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage