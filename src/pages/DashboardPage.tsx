import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TVDisplayCard from '../components/TVDisplayCard'
import 'sweetalert2/dist/sweetalert2.min.css'
import socket from '../socket'
import { apiUrl, authHeaders } from '../services/api'
import type { ScreenRecord, SocketScreenUpdate } from '../types/screen'

type DashboardCard = {
  id: string | null
  screen_id: string
  customer_name: string | null
  brand: string | null
  type: string | null
  license_plate: string | null
  year: string | null
  estimated_time: string | null
  service: string | null
  status: 'Active' | 'Inactive'
} | null

const screenRooms = [
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000004',
]

const emptySlots = (): DashboardCard[] => [null, null, null, null]

const toDashboardCard = (screen: ScreenRecord): Exclude<DashboardCard, null> => ({
  id: screen.id,
  screen_id: screen.screen_id,
  customer_name: screen.customer_name || '',
  brand: screen.brand || '',
  type: screen.type || '',
  license_plate: screen.license_plate || '',
  year: screen.year ? String(screen.year) : '',
  estimated_time: screen.estimated_time || '',
  service: screen.service || '',
  status: screen.id ? 'Active' : 'Inactive',
})

const toDisplayCardData = (card: DashboardCard) => ({
  customer_name: card?.customer_name || '',
  brand: card?.brand || '',
  type: card?.type || '',
  service: card?.service || '',
  license_plate: card?.license_plate || '',
  status: card?.status || 'Inactive',
  year: card?.year || '',
  estimated_time: card?.estimated_time || '',
})

export default function DashboardPage() {
  const [cards, setCards] = useState<DashboardCard[]>(emptySlots())
  const [sidebarWidth, setSidebarWidth] = useState(256)

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl('/api/screens'), {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ScreenRecord[] = await res.json()
      const uniqueScreens = Array.from(
        new Map(data.map((screen) => [screen.screen_id, screen])).values(),
      )

      const mapped = emptySlots()
      uniqueScreens.forEach((screen, index) => {
        const idx = screen.display_number ? screen.display_number - 1 : index
        if (idx >= 0 && idx < mapped.length) {
          mapped[idx] = toDashboardCard(screen)
        }
      })
      setCards(mapped)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    fetchData()
    screenRooms.forEach((screenId) => socket.emit('join_screen', screenId))

    const handleScreenUpdate = ({ screen_id, payload }: SocketScreenUpdate) => {
      setCards((prev) => {
        const updated = [...prev]
        const idx = prev.findIndex((card) => card?.screen_id === screen_id)
        if (idx === -1) return prev

        updated[idx] = payload.is_active
          ? toDashboardCard({ ...payload, screen_id })
          : {
              screen_id,
              id: null,
              customer_name: null,
              brand: null,
              type: null,
              license_plate: null,
              year: null,
              service: null,
              estimated_time: null,
              status: 'Inactive',
            }

        return updated
      })
    }

    socket.on('screen:update', handleScreenUpdate)
    return () => {
      socket.off('screen:update', handleScreenUpdate)
    }
  }, [])

  const handleRemoveFromDisplay = async (index: number) => {
    const screen = cards[index]
    if (!screen?.screen_id) return

    const confirm = await Swal.fire({
      title: 'Hapus Slot?',
      text: 'Data pelanggan akan dinonaktifkan dari display ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3847D1',
    })
    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(apiUrl(`/api/screens/${screen.screen_id}/remove`), {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
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
      console.error('Gagal menghapus slot:', err)
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghapus',
        text: 'Tidak dapat menonaktifkan display slot.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onWidthChange={setSidebarWidth} />

      <main
        className="transition-all duration-300 overflow-y-auto"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Navbar title="Dashboard" />

        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <div
              key={card?.screen_id ?? i}
              className="rounded-xl bg-white shadow-sm p-3 flex flex-col items-center"
            >
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
                data={toDisplayCardData(card)}
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
