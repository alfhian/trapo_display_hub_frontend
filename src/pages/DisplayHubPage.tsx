import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import 'sweetalert2/dist/sweetalert2.min.css'

import { getServices } from '../config/services'
import { getEstimatedFinishDate } from '../utils/timeUtils'

type CardData = {
  customerName: string
  brand: string
  carType: string
  year: string
  service: string
  licensePlate: string
  status: string
  time: string
  screenId?: string
} | null

function DisplayHubPage() {
  const [cards, setCards] = useState<CardData[]>([null, null, null, null])
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({})

  // ✅ Ambil data awal dari backend
  const fetchScreens = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/screens`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to fetch screen data.')
      const data = await res.json()

      const mapped = [null, null, null, null]
      data.forEach((screen: any) => {
        const idx = screen.display_number - 1
        if (idx >= 0 && idx < 4) {
          mapped[idx] = {
            customerName: screen.customername || '',
            brand: screen.brand || '',
            carType: screen.cartype || '',
            year: screen.year || '',
            service: screen.service || '',
            licensePlate: screen.licenseplate || '',
            status: screen.customername ? 'Active' : 'Inactive',
            time: screen.updated_at || '-',
            screenId: screen.id,
          }
        }
      })
      setCards(mapped)
    } catch (err) {
      console.error('Error fetching screens:', err)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load display hub data.',
      })
    }
  }

  useEffect(() => {
    fetchScreens()
  }, [])

  const handleDisplay = async (
    index: number,
    formData: { customerName: string; brand: string; carType: string; year: string; service: string; licensePlate: string }
  ) => {
    setIsLoading(prev => ({ ...prev, [index]: true }))
    const tvId = cards[index]?.screenId

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/screens/${tvId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to send data to TV display.')
      await response.json()

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer data has been sent to TV display.',
        timer: 1500,
        showConfirmButton: false,
      })

      fetchScreens()
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err instanceof Error ? err.message : 'Unknown error.',
      })
    } finally {
      setIsLoading(prev => ({ ...prev, [index]: false }))
    }
  }

  const handleRemove = async (index: number) => {
    const tvId = cards[index]?.screenId
    if (!tvId) return

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
    })

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token')
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/screens/${tvId}/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerName: '',
            brand: '',
            carType: '',
            year: '',
            service: '',
            licensePlate: '',
          }),
        })

        Swal.fire({
          title: 'Removed!',
          text: 'Slot cleared successfully.',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
        })

        fetchScreens()
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove data from display slot.',
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] relative">
      <Sidebar isHovered={isSidebarHovered} setIsHovered={setIsSidebarHovered} />
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 overflow-y-auto transition-all duration-300">
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
                  {card && card.status === 'Active' ? (
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
                isLoading={isLoading[index] || false}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

// ✅ Subcomponent FormCard (tetap tampilan lama tapi ada kolom Year)
function FormCard({
  index,
  initialData,
  onDisplay,
  onRemove,
  isLoading
}: {
  index: number
  initialData: CardData
  onDisplay: (index: number, formData: { customerName: string; brand: string; carType: string; year: string; service: string; licensePlate: string }) => void
  onRemove: (index: number) => void
  isLoading: boolean
}) {
  const [form, setForm] = useState({
    customerName: initialData?.customerName || '',
    brand: initialData?.brand || '',
    carType: initialData?.carType || '',
    year: initialData?.year || '',
    service: initialData?.service || '',
    licensePlate: initialData?.licensePlate || '',
  })

  const [services, setServices] = useState(getServices)
  const isActive = !!initialData?.customerName

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service) {
      alert('Please select service first.')
      return
    }
    if (isActive) onRemove(index)
    else onDisplay(index, form)
  }

  const estimatedTime = form.service ? getEstimatedFinishDate(form.service).toLocaleString() : '-'

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-700">
      {[ 
        { label: 'Customer Name', name: 'customerName' },
        { label: 'Car Brand', name: 'brand' },
        { label: 'Type', name: 'carType' },
        { label: 'Year', name: 'year' },
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
            disabled={isActive || isLoading}
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
          disabled={isActive || isLoading}
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
          disabled={isActive || isLoading}
          required
        >
          <option value="">Select Service</option>
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

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className={`mt-5 px-8 sm:px-10 py-2.5 rounded-full text-sm sm:text-base font-semibold text-white transition-all duration-300 shadow-sm ${
            isActive
              ? 'bg-[#f68b8b] hover:bg-[#f57b7b]'
              : 'bg-[#7883ff] hover:bg-[#6a73e6]'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading
            ? 'Processing...'
            : isActive ? 'Remove' : 'Display'}
        </button>

        {isActive && (
          <a
            href={`/display/${initialData?.screenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 px-8 sm:px-10 py-2.5 rounded-full text-sm sm:text-base font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-300 shadow-sm"
          >
            View on TV
          </a>
        )}
      </div>
    </form>
  )
}

export default DisplayHubPage
