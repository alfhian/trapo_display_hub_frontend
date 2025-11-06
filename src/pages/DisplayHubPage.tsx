import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import 'sweetalert2/dist/sweetalert2.min.css'
import { getServices } from '../config/services'
import { getEstimatedFinishDate } from '../utils/timeUtils'

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

export default function DisplayHubPage() {
  const [cards, setCards] = useState<CardData[]>([])
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  // 🔹 Fetch data awal
  const fetchScreens = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch screens')
      const data: ScreenPayload[] = await response.json()

      const mapped = data.map((s) => ({
        id: s.id,
        screenId: s.screen_id,
        customerName: s.customer_name ?? '',
        brand: s.brand ?? '',
        carType: s.type ?? '',
        year: s.year ?? '',
        service: s.service ?? '',
        licensePlate: s.license_plate ?? '',
        estimatedTime: s.estimated_time ?? '',
        time: s.estimated_time ?? '-',
        status: s.customer_name ? 'Active' : 'Inactive',
      }))
      setCards(mapped)
    } catch (e) {
      Swal.fire('Error', 'Failed to load display hub data.', 'error')
    }
  }

  useEffect(() => {
    fetchScreens()
  }, [])

  // 🔹 Assign Display
  const handleDisplay = async (index: number, form: Omit<CardData, 'status' | 'time'>) => {
    const tvId = cards[index]?.screenId
    if (!tvId) return
    setIsLoading((p) => ({ ...p, [tvId]: true }))

    try {
      const token = localStorage.getItem('token')
      const estimatedTime = getEstimatedFinishDate(form.service).toISOString()

      const payload: ScreenPayload = {
        id: tvId,
        customer_name: form.customerName,
        brand: form.brand,
        type: form.carType,
        year: form.year,
        license_plate: form.licensePlate,
        service: form.service,
        estimated_time: estimatedTime,
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${tvId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to assign')
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer data sent to TV display.',
        timer: 1500,
        showConfirmButton: false,
      })
      fetchScreens()
    } catch (err) {
      Swal.fire('Error', err instanceof Error ? err.message : 'Unknown error', 'error')
    } finally {
      setIsLoading((p) => ({ ...p, [tvId]: false }))
    }
  }

  // 🔹 Remove Display
  const handleRemove = async (index: number, resetForm?: () => void) => {
    const tvId = cards[index]?.id
    if (!tvId) return

    const confirm = await Swal.fire({
      title: 'Remove Display?',
      text: 'This slot will be marked as inactive.',
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
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${tvId}/remove`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed')

      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'Display slot has been deactivated.',
        timer: 1200,
        showConfirmButton: false,
      })

      setCards((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], status: 'Inactive' } as CardData
        return updated
      })
      resetForm?.()
    } catch {
      Swal.fire('Error', 'Failed to deactivate display.', 'error')
    }
  }

  const [sidebarWidth, setSidebarWidth] = useState(256)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar onWidthChange={setSidebarWidth} />

      <main
        className="transition-all duration-300 overflow-y-auto"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <Navbar title="Display Hub (Management)" />
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <DisplayCard
              key={card.screenId}
              index={index}
              card={card}
              onDisplay={handleDisplay}
              onRemove={handleRemove}
              isLoading={!!isLoading[card.screenId]}
            />
          ))}
        </div>
      </main>
    </div>
  )

}

/* ----------------------------- Subcomponent ----------------------------- */
function DisplayCard({
  index,
  card,
  onDisplay,
  onRemove,
  isLoading,
}: {
  index: number
  card: CardData
  onDisplay: (index: number, form: Omit<CardData, 'status' | 'time'>) => void
  onRemove: (index: number, resetForm?: () => void) => void
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
  const services = getServices()
  const isActive = card.status === 'Active'
  const estimatedTime = form.service ? getEstimatedFinishDate(form.service).toLocaleString() : '-'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () =>
    setForm({ customerName: '', brand: '', carType: '', year: '', service: '', licensePlate: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.service) return alert('Please select a service.')
    if (isActive) await onRemove(index, resetForm)
    else onDisplay(index, { ...form, estimatedTime })
  }

  return (
    <div className="rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Slot {index + 1}</h3>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-2">
        {[
          { label: 'Customer Name', name: 'customerName' },
          { label: 'Car Brand', name: 'brand' },
          { label: 'Type', name: 'carType' },
          { label: 'Year', name: 'year' },
          { label: 'License Plate', name: 'licensePlate' },
        ].map((f) => (
          <InputField
            key={f.name}
            label={f.label}
            name={f.name}
            value={form[f.name as keyof typeof form]}
            onChange={handleChange}
            disabled={isActive || isLoading}
          />
        ))}

        <SelectField
          label="Service"
          name="service"
          value={form.service}
          onChange={handleChange}
          options={services.map((s) => ({ label: s.label, value: s.value }))}
          disabled={isActive || isLoading}
        />

        <InputField label="Estimated Time" value={estimatedTime} disabled readOnly />

        <div className="flex justify-between items-center pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-2.5 rounded-full font-semibold text-white transition-all duration-300 shadow-sm ${
              isActive
                ? 'bg-[#f68b8b] hover:bg-[#f57b7b]'
                : 'bg-[#3847D1] hover:bg-[#2e3ab8]'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : isActive ? 'Remove' : 'Display'}
          </button>

          {isActive && (
            <a
              href={`/display/${card.screenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-2.5 rounded-full text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-300 shadow-sm"
            >
              View on TV
            </a>
          )}
        </div>
      </form>
    </div>
  )
}

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
      <label className="w-32 text-right font-semibold text-gray-800 text-sm">{label}</label>
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
      <label className="w-32 text-right font-semibold text-gray-800 text-sm">{label}</label>
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
