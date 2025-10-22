import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'
import TVDisplayCard from '../components/TVDisplayCard'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

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
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dashboardSlots')
    if (stored) setCards(JSON.parse(stored))
  }, [])

  const updateStorage = (updated: CardData[]) => {
    setCards(updated)
    localStorage.setItem('dashboardSlots', JSON.stringify(updated))
  }

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
      <Sidebar isHovered={isSidebarHovered} setIsHovered={setIsSidebarHovered} />
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 max-h-screen overflow-y-auto transition-all duration-300">
        <Navbar title="Dashboard" />
        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-10 gap-y-1">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-0">
              <div className="border-transparent p-4 sm:p-8">
                <Card
                  number={i + 1}
                  status={cards[i]?.status === 'Active' ? 'Active' : 'Inactive'}
                  date={cards[i]?.time || '-'}
                />
              </div>
              <TVDisplayCard 
                data={cards[i]} 
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