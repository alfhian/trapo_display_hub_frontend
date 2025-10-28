import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Swal from 'sweetalert2'
import axios from 'axios'
import 'sweetalert2/dist/sweetalert2.min.css'

function DashboardPage() {
  const [cards, setCards] = useState<Array<{
    customerName: String,
    brand: String,
    carType: String,
    service: String,
    licensePlate: String,
    time: String,
    status: String
  } | null>>([null, null, null, null])

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const fetchData = async () => {
    try {
      const res = await axios(import.meta.env.VITE_BACKEND_URL+'/screens', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      const data = res.data;
      setCards(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetchData();
  }, [])

  

  const handleRemoveFromDisplay = async (index: number) => {
    const result = await Swal.fire({
      title: 'Hapus Slot?',
      text: 'Data pelanggan akan dihapus.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#3847D1',
      background: '#fff',
    })
    if (result.isConfirmed) {
      const updated = [...cards]
      updated[index] = null
      Swal.fire({ title: 'Dihapus', icon: 'success', timer: 1000, showConfirmButton: false })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      <main className="flex-1 overflow-y-auto">
        <Navbar title="Dashboard" />
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  Slot {i + 1}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    cards[i]?.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {cards[i]?.status === 'Active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Customer Info */}
              {cards[i] ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{cards[i]?.customerName}</p>
                  <p>{cards[i]?.brand} – {cards[i]?.carType}</p>
                  <p className="text-gray-500 text-xs">{cards[i]?.service}</p>
                  <p className="text-gray-500 text-xs">{cards[i]?.licensePlate}</p>
                  <p className="text-[11px] text-gray-400 mt-2">Updated: {cards[i]?.time}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No data assigned.</p>
              )}

              {/* Remove Button */}
              <div className="text-right mt-3">
                <button
                  onClick={() => handleRemoveFromDisplay(i)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Clear Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
