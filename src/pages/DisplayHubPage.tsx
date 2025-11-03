import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import 'sweetalert2/dist/sweetalert2.min.css'

import { getServices } from '../config/services'
import { getEstimatedFinishDate } from '../utils/timeUtils'

/* ----------------------------- Type Definitions ----------------------------- */
export type ScreenPayload = {
  id: string
  customer_name: string | null
  brand: string | null
  type: string | null
  year: string | null
  license_plate: string | null
  service: string | null
  estimated_time: string | null
}

export type CardData = {
  id: string
  screenId: string
  customerName: string
  brand: string
  carType: string
  year: string
  service: string
  licensePlate: string
  estimatedTime: string
  status: 'Active' | 'Inactive'
  time: string
}

/* ----------------------------- Main Component ----------------------------- */
/* ----------------------------- MAIN COMPONENT ----------------------------- */
function DisplayHubPage() {
  const [cards, setCards] = useState<CardData[]>([])
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  /* ----------------------------- Fetch Data ----------------------------- */
  const fetchScreens = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to fetch screen data.')
      const data: ScreenPayload[] = await response.json()

      // Map ke format CardData
      const mappedCards: CardData[] = data.map((screen) => ({
        id: screen.id,
        screenId: screen.screen_id,
        customerName: screen.customer_name ?? '',
        brand: screen.brand ?? '',
        carType: screen.type ?? '',
        year: screen.year ?? '',
        service: screen.service ?? '',
        licensePlate: screen.license_plate ?? '',
        estimatedTime: screen.estimated_time ?? '',
        time: screen.estimated_time ?? '-',
        status: screen.customer_name ? 'Active' : 'Inactive',
      }))

      setCards(mappedCards)
    } catch (err) {
      console.error('Error fetching screens:', err)
      Swal.fire('Error', 'Failed to load display hub data.', 'error')
    }
  }

  useEffect(() => {
    fetchScreens()
  }, [])

  /* ----------------------------- Assign Display ----------------------------- */
  const handleDisplay = async (index: number, formData: Omit<CardData, 'status' | 'time'>) => {
    const tvId = cards[index]?.screenId
    if (!tvId) return

    setIsLoading((prev) => ({ ...prev, [tvId]: true }))

    try {
      const token = localStorage.getItem('token')
      const estimatedDate = getEstimatedFinishDate(formData.service)
      const estimatedTime = estimatedDate.toISOString()

      const payload: ScreenPayload = {
        id: tvId,
        customer_name: formData.customerName,
        brand: formData.brand,
        type: formData.carType,
        year: formData.year,
        license_plate: formData.licensePlate,
        service: formData.service,
        estimated_time: estimatedTime,
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${tvId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to send data to TV display.')

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer data sent to TV display.',
        timer: 1500,
        showConfirmButton: false,
      })

      // Tidak fetch ulang; dashboard realtime akan auto update
      fetchScreens()
    } catch (err) {
      Swal.fire('Error', err instanceof Error ? err.message : 'Unknown error.', 'error')
    } finally {
      setIsLoading((prev) => ({ ...prev, [tvId]: false }))
    }
  }

  /* ----------------------------- REMOVE DISPLAY ----------------------------- */
  const handleRemove = async (index: number) => {
    const tvId = cards[index]?.id
    if (!tvId) return

    const confirm = await Swal.fire({
      title: 'Remove Display?',
      text: 'This will mark the display slot as inactive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#f68b8b',
    })

    if (!confirm.isConfirmed) return

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${tvId}/remove`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error(`Failed: ${response.status}`)

      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'Display slot has been deactivated.',
        timer: 1200,
        showConfirmButton: false,
      })

      // Update state → status jadi Inactive
      setCards((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: 'Inactive' } as CardData
        return updated
      })
    } catch (error) {
      console.error('Remove display failed:', error)
      Swal.fire('Error', 'Failed to deactivate display slot.', 'error')
    }
  }

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar isHovered={isSidebarHovered} setIsHovered={setIsSidebarHovered} />

      <main className="flex-1 px-4 sm:px-8 md:px-12 py-8 md:py-12 overflow-y-auto">
        <Navbar title="Display Hub" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <DisplayCard
              key={card.screenId}
              index={index}
              card={card}
              onDisplay={handleDisplay}
              onRemove={(i) => handleRemove(i, () => resetForm(i))}
              isLoading={!!isLoading[card.screenId]}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

/* ----------------------------- Subcomponent: DisplayCard ----------------------------- */
function DisplayCard({
  index,
  card,
  onDisplay,
  onRemove,
  isLoading,
}: {
  index: number
  card: CardData
  onDisplay: (index: number, formData: Omit<CardData, 'status' | 'time'>) => void
  onRemove: (index: number) => void
  isLoading: boolean
}) {
  const [form, setForm] = useState({
    customerName: card.customerName,
    brand: card.brand,
    carType: card.carType,
    year: card.year,
    service: card.service,
    licensePlate: card.licensePlate,
  })

  const resetForm = () =>
    setForm({
      customerName: '',
      brand: '',
      carType: '',
      year: '',
      service: '',
      licensePlate: '',
    })

  const services = getServices()
  const isActive = card.status === 'Active'
  const estimatedTime = form.service ? getEstimatedFinishDate(form.service).toLocaleString() : '-'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service) return alert('Please select a service first.')

    if (isActive) {
      await onRemove(index) // tunggu selesai
      resetForm() // 🔥 langsung clear form
    } else {
      onDisplay(index, { ...form, estimatedTime })
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-lg sm:text-xl font-bold text-gray-700">
          {index + 1}
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <CheckCircle className="text-green-500 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-green-600 font-semibold text-sm sm:text-base">Active</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-400 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-red-500 font-semibold text-sm sm:text-base">Inactive</span>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-700">
        {[ 
          { label: 'Customer Name', name: 'customerName' },
          { label: 'Car Brand', name: 'brand' },
          { label: 'Type', name: 'carType' },
          { label: 'Year', name: 'year' },
        ].map((field) => (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
            disabled={isActive || isLoading}
          />
        ))}

        <InputField
          label="License Plate"
          name="licensePlate"
          value={form.licensePlate}
          onChange={handleChange}
          disabled={isActive || isLoading}
        />

        <SelectField
          label="Service"
          name="service"
          value={form.service}
          onChange={handleChange}
          options={getServices().map((s) => ({ label: s.label, value: s.value }))}
          disabled={isActive || isLoading}
        />

        <InputField label="Estimated Time" value={estimatedTime} disabled readOnly />

        {/* Buttons */}
        <div className="flex justify-between items-center pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 sm:px-10 py-2.5 rounded-full font-semibold text-white transition-all duration-300 shadow-sm ${
              isActive
                ? 'bg-[#f68b8b] hover:bg-[#f57b7b]'
                : 'bg-[#7883ff] hover:bg-[#6a73e6]'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : isActive ? 'Remove' : 'Display'}
          </button>

          {isActive && (
            <a
              href={`/display/${card.screenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 sm:px-10 py-2.5 rounded-full text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-300 shadow-sm"
            >
              View on TV
            </a>
          )}
        </div>
      </form>
    </div>
  )
}

/* ----------------------------- Reusable UI Components ----------------------------- */
function InputField({
  label,
  name,
  value,
  onChange,
  disabled = false,
  readOnly = false,
}: {
  label: string
  name?: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  readOnly?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <label className="w-36 sm:w-40 text-right font-semibold text-gray-800">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={`flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'
        }`}
      />
    </div>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { label: string; value: string }[]
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-1">
      <label className="w-36 sm:w-40 text-right font-semibold text-gray-800">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DisplayHubPage
