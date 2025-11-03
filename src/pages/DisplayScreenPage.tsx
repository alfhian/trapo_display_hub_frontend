import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import LiveTVDisplay from '../components/LiveTVDisplay'

type ScreenData = {
  id: string
  screen_id: string
  customer_name: string | null
  brand: string | null
  type: string | null
  license_plate: string | null
  year: string | null
  service: string | null
  estimated_time: string | null
  is_active?: boolean
} | null

// 🔌 Socket client
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
})

export default function DisplayScreenPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ScreenData | null>(null)
  const [loading, setLoading] = useState(true)

  // 📡 Fetch single screen
  const fetchScreen = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching screen data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 🧭 Lifecycle
  useEffect(() => {
    if (!id) return
    fetchScreen()

    // Join room realtime
    socket.on('connect', () => {
      console.log('🟢 Connected socket for screen', id)
      socket.emit('join_screen', id)
    })

    socket.on('screen:update', ({ screen_id, payload }) => {
      if (screen_id === id) {
        console.log('📡 Update for this screen:', payload)
        setData(payload.is_active ? payload : makeEmptyCard(id))
      }
    })

    // ✅ AUTO FULLSCREEN
    const goFullscreen = async () => {
      try {
        const elem = document.documentElement
        if (elem.requestFullscreen) await elem.requestFullscreen()
        else if ((elem as any).webkitRequestFullscreen) (elem as any).webkitRequestFullscreen()
        else if ((elem as any).msRequestFullscreen) (elem as any).msRequestFullscreen()
      } catch (err) {
        console.warn('⚠️ Fullscreen not allowed:', err)
      }
    }
    goFullscreen()

    return () => {
      socket.off('screen:update')
    }
  }, [id])

  // Loading
  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    )
  }

  // 🧩 Pastikan card tetap ada walau kosong
  const displayData =
    data && data.customer_name
      ? data
      : makeEmptyCard(id || '00000000-0000-0000-0000-000000000000')

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <LiveTVDisplay
        data={{
          customer_name: displayData.customer_name || '',
          brand: displayData.brand || '',
          type: displayData.type || '',
          license_plate: displayData.license_plate || '',
          year: displayData.year || '',
          service: displayData.service || '',
          estimated_time: displayData.estimated_time || '',
          status: displayData.is_active ? 'Active' : 'Inactive',
        }}
        index={getScreenNumber(id)}
        onRemove={() => {}}
        isTVOutput
      />
    </div>
  )
}

/* 🧱 Fungsi bantu — buat “card kosong” dengan tampilan tetap */
function makeEmptyCard(screen_id: string) {
  return {
    id: screen_id,
    screen_id,
    customer_name: '',
    brand: '–',
    type: '',
    license_plate: '–',
    year: '',
    service: '–',
    estimated_time: '',
    is_active: false,
  }
}

/* 🔹 Urutan slot */
function getScreenNumber(screenId: string | undefined) {
  const screenOrder = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
  ]
  const index = screenOrder.findIndex((id) => id === screenId)
  return index !== -1 ? index : 0
}
