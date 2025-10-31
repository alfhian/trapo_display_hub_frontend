import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Swal from 'sweetalert2'
import TVDisplayCard from '../components/TVDisplayCard'
import 'sweetalert2/dist/sweetalert2.min.css'

type ScreenData = {
  id?: string
  customer_name?: string
  brand?: string
  type?: string
  license_plate?: string
  year?: string
  etc?: string
  service?: string
  updated_at?: string
  status?: string
} | null

function DashboardPage() {
  const [cards, setCards] = useState<ScreenData[]>([null, null, null, null])
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/screens`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      // mapping 4 slot; kalau tidak ada display_number, isi urutan biasa
      const mapped = [null, null, null, null]
      data.forEach((screen: any, index: number) => {
        const idx = screen.display_number ? screen.display_number - 1 : index
        if (idx >= 0 && idx < 4) {
          mapped[idx] = {
            id: screen.id,
            customer_name: screen.customer_name || '',
            brand: screen.brand || '',
            type: screen.type || '',
            license_plate: screen.license_plate || '',
            year: screen.year || '',
            etc: screen.etc || '',
            service: screen.service || '',
            updated_at: screen.updated_at || '',
            status: screen.customer_name ? 'Active' : 'Inactive',
          }
        }
      })

      setCards(mapped)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRemoveFromDisplay = async (index: number) => {
    const screen = cards[index]
    if (!screen?.id) return

    const result = await Swal.fire({
      title: 'Hapus Slot?',
      text: 'Data pelanggan akan dihapus dari display ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3847D1',
      background: '#fff',
    })

    if (!result.isConfirmed) return

    try {
      const token = localStorage.getItem('token')
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/screens/${screen.id}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: '',
          brand: '',
          type: '',
          license_plate: '',
          year: '',
          service: '',
        }),
      })

      Swal.fire({
        title: 'Dihapus!',
        text: 'Slot berhasil dikosongkan.',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      })

      fetchData()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: 'Tidak dapat menghapus data slot.',
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      <main className="flex-1 overflow-y-auto">
        <Navbar title="Dashboard" />

        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="rounded-xl bg-white shadow-sm p-3 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 px-1">
                <h3 className="text-sm font-semibold text-gray-700">Slot {i + 1}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card?.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {card?.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <TVDisplayCard
                data={
                  card
                    ? {
                        customerName: card.customer_name || '',
                        brand: card.brand || '',
                        carType: card.type || '',
                        service: card.service || '',
                        licensePlate: card.license_plate || '',
                        time: card.updated_at || '-',
                        status: card.status || 'Inactive',
                        year: card.year || '',
                        etc: card.etc || '',
                      }
                    : null
                }
                index={i}
                onRemove={handleRemoveFromDisplay}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
