import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LiveTVDisplay from '../components/LiveTVDisplay'
import socket from '../socket'
import { apiUrl } from '../services/api'
import type { ScreenRecord, SocketScreenUpdate } from '../types/screen'

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

const makeEmptyCard = (screen_id: string): ScreenRecord => ({
  id: screen_id,
  screen_id,
  customer_name: '',
  brand: '-',
  type: '',
  license_plate: '-',
  year: '',
  service: '-',
  estimated_time: '',
  is_active: false,
})

const getScreenNumber = (screenId: string | undefined) => {
  const screenOrder = [
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
  ]
  const index = screenOrder.findIndex((id) => id === screenId)
  return index !== -1 ? index : 0
}

export default function DisplayScreenPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<ScreenRecord | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchScreen = useCallback(async () => {
    if (!id) return

    try {
      const res = await fetch(apiUrl(`/api/screens/${id}`))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const result: ScreenRecord = await res.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching screen data:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    fetchScreen()

    const joinScreen = () => socket.emit('join_screen', id)
    const handleScreenUpdate = ({ screen_id, payload }: SocketScreenUpdate) => {
      if (screen_id === id) {
        setData(payload.is_active ? payload : makeEmptyCard(id))
      }
    }

    if (socket.connected) joinScreen()
    socket.on('connect', joinScreen)
    socket.on('screen:update', handleScreenUpdate)

    const goFullscreen = async () => {
      try {
        const elem = document.documentElement as FullscreenElement
        if (elem.requestFullscreen) await elem.requestFullscreen()
        else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen()
        else if (elem.msRequestFullscreen) await elem.msRequestFullscreen()
      } catch (err) {
        console.warn('Fullscreen not allowed:', err)
      }
    }
    goFullscreen()

    return () => {
      socket.off('connect', joinScreen)
      socket.off('screen:update', handleScreenUpdate)
    }
  }, [fetchScreen, id])

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    )
  }

  const displayData =
    data && data.customer_name ? data : makeEmptyCard(id || '00000000-0000-0000-0000-000000000000')

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <LiveTVDisplay
        data={{
          customer_name: displayData.customer_name || '',
          brand: displayData.brand || '',
          type: displayData.type || '',
          license_plate: displayData.license_plate || '',
          year: displayData.year ? String(displayData.year) : '',
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
