import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'

type CardData = {
  customerName: string
  brand: string
  carType: string
  service: string
  status: string
  time: string
} | null

function DashboardPage() {
  const [cards, setCards] = useState<CardData[]>([null, null, null, null])

  useEffect(() => {
    const stored = localStorage.getItem('dashboardSlots')
    if (stored) setCards(JSON.parse(stored))
  }, [])

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* ✅ Lebarkan Sidebar untuk konsistensi dengan DisplayHubPage */}
      <div className="w-60 md:w-64">
        <Sidebar />
      </div>

      {/* ✅ Gunakan padding responsif seperti DisplayHubPage */}
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 max-h-screen overflow-y-auto transition-all duration-300">
        <Navbar title="Dashboard" />

        {/* ✅ Jarak atas di bawah navbar diperlebar */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {/* Status Cards */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8"
            >
              <Card
                number={i + 1}
                status={cards[i]?.status === 'Active' ? 'Active' : 'Inactive'}
                date={cards[i]?.time || '-'}
              />
            </div>
          ))}
        </div>

        {/* ✅ Grid kotak bernomor di bawah — gunakan gaya spacing sama */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-10">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="w-full">
              <div className="bg-gray-200 aspect-video flex items-center justify-center text-4xl font-bold text-gray-500 rounded-3xl">
                {num}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
