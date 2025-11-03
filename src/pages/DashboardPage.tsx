import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Swal from 'sweetalert2'
import TVDisplayCard from '../components/TVDisplayCard'
import 'sweetalert2/dist/sweetalert2.min.css'
import socket from '../socket'

console.log('🌍 Connecting to socket server:', import.meta.env.VITE_BACKEND_URL)


type ScreenData = {
  id: string
  screen_id: string
  customer_name: string | null
  brand: string | null
  type: string | null
  license_plate: string | null
  year: string | null
  estimated_time: string | null
  service: string | null
  updated_at: string | null
  status: 'Active' | 'Inactive'
} | null

export default function DashboardPage() {
  const [cards, setCards] = useState<ScreenData[]>([null, null, null, null])
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  // ✅ Fetch data awal
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      // mapping 4 slot berdasarkan display_number
      const mapped = [null, null, null, null]
        data.forEach((screen: any, index: number) => {
          const idx = screen.display_number ? screen.display_number - 1 : index
          if (idx >= 0 && idx < 4) {
            mapped[idx] = {
              id: screen.id, // id dari screen_display
              screen_id: screen.screen_id, // ✅ tambahkan ini agar cocok dengan payload socket
              customer_name: screen.customer_name || '',
              brand: screen.brand || '',
              type: screen.type || '',
              license_plate: screen.license_plate || '',
              year: screen.year || '',
              estimated_time: screen.estimated_time || '',
              service: screen.service || '',
              status: screen.customer_name ? 'Active' : 'Inactive',
            }
          }
        })
        setCards(mapped)
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error)
    }
  }

  // ✅ Socket & fetch lifecycle
  useEffect(() => {
    fetchData()

    console.log('📡 Dashboard mounted')

    socket.emit('join_screen', '00000000-0000-0000-0000-000000000001')
    socket.emit('join_screen', '00000000-0000-0000-0000-000000000002')
    socket.emit('join_screen', '00000000-0000-0000-0000-000000000003')
    socket.emit('join_screen', '00000000-0000-0000-0000-000000000004')

    socket.on('screen:update', ({ screen_id, payload }) => {
      console.log('📡 [Realtime Update] screen_id:', screen_id, payload)

      setCards((prev) => {
        const updated = [...prev]
        const idx = prev.findIndex((c) => c?.screen_id === screen_id)

        if (idx !== -1) {
          // ✅ Jika data baru aktif, isi slot
          if (payload.is_active) {
            updated[idx] = {
              screen_id,
              id: payload.id,
              customer_name: payload.customer_name,
              brand: payload.brand,
              type: payload.type,
              license_plate: payload.license_plate,
              year: payload.year,
              service: payload.service,
              estimated_time: payload.estimated_time,
            }
          } else {
            // ❌ Jika dihapus, kosongkan field saja (bukan null)
            updated[idx] = {
              screen_id,
              id: null,
              customer_name: null,
              brand: null,
              type: null,
              license_plate: null,
              year: null,
              service: null,
              estimated_time: null,
            }
          }
        }

        return updated
      })
    })

    socket.onAny((event, ...args) => {
      console.log('🛰️ Received socket event:', event, args)
    })

    return () => {
      console.log('🧹 Cleaning socket listeners')
      socket.off('screen:update')
      socket.offAny()
    }
  }, [])

  // ✅ Remove display (mark inactive)
  const handleRemoveFromDisplay = async (index: number) => {
    const screen = cards[index]
    if (!screen?.id) return

    const confirm = await Swal.fire({
      title: 'Hapus Slot?',
      text: 'Data pelanggan akan dinonaktifkan dari display ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3847D1',
      background: '#fff',
    })

    if (!confirm.isConfirmed) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${screen.id}/remove`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      Swal.fire({
        title: 'Dihapus!',
        text: 'Slot berhasil dinonaktifkan.',
        icon: 'success',
        timer: 1200,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error('❌ Gagal menghapus slot:', err)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: 'Tidak dapat menonaktifkan display slot.',
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      <main className="flex-1 overflow-y-auto">
        <Navbar title="Dashboard (Realtime)" />

        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="rounded-xl bg-white shadow-sm p-3 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-3 px-1">
                <h3 className="text-sm font-semibold text-gray-700">Slot {i + 1}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card?.customer_name
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {card?.customer_name ? 'Active' : 'Inactive'}
                </span>
              </div>

              <TVDisplayCard
                data={
                  card && card.customer_name
                    ? card
                    : {
                        customer_name: '',
                        brand: '',
                        type: '',
                        service: '',
                        license_plate: '',
                        status: 'Inactive',
                        year: '',
                        estimated_time: '',
                      }
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
