import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import 'sweetalert2/dist/sweetalert2.min.css'
import { getServices } from '../config/services'
import { getEstimatedFinishDate } from '../utils/timeUtils'
import { apiUrl, authHeaders } from '../services/api'

type ScreenRecord = {
  id: string | null
  screen_id: string
  customer_name: string | null
  brand: string | null
  type: string | null
  year: string | number | null
  license_plate: string | null
  service: string | null
  estimated_time: string | null
}

type ScreenPayload = {
  screen_id: string
  id: string | null
  customer_name: string
  brand: string
  type: string
  year?: string | null
  service: string
  license_plate: string
  estimated_time: string
  status: 'Active' | 'Inactive' | string
}

type CardData = {
  id: string | null
  screenId: string
  customerName: string
  brand: string
  carType: string
  year: string
  service: string
  licensePlate: string
  estimatedTime: string
  status: 'Active' | 'Inactive' | string
  time: string
}

const getUniqueScreens = (screens: ScreenRecord[]) => {
  const uniqueScreens = new Map<string, ScreenRecord>()
  screens.forEach((screen) => {
    if (!uniqueScreens.has(screen.screen_id)) {
      uniqueScreens.set(screen.screen_id, screen)
    }
  })
  return Array.from(uniqueScreens.values())
}

export default function DisplayHubPage() {
  const [cards, setCards] = useState<CardData[]>([])
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [sidebarWidth, setSidebarWidth] = useState(256)

  const fetchScreens = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/api/screens'), {
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to fetch screens')
      const data: ScreenRecord[] = await response.json()

      const mapped = getUniqueScreens(data).map((screen) => ({
        id: screen.id ?? null,
        screenId: screen.screen_id,
        customerName: screen.customer_name ?? '',
        brand: screen.brand ?? '',
        carType: screen.type ?? '',
        year: screen.year ? String(screen.year) : '',
        service: screen.service ?? '',
        licensePlate: screen.license_plate ?? '',
        estimatedTime: screen.estimated_time ?? '',
        time: screen.estimated_time ?? '-',
        status: screen.id ? 'Active' : 'Inactive',
      }))
      setCards(mapped)
    } catch {
      Swal.fire('Error', 'Failed to load display hub data.', 'error')
    }
  }, [])

  useEffect(() => {
    fetchScreens()
  }, [fetchScreens])

  const handleDisplay = async (index: number, form: Omit<CardData, 'status' | 'time'>) => {
    const tvId = cards[index]?.screenId
    if (!tvId) return
    setIsLoading((previous) => ({ ...previous, [tvId]: true }))

    try {
      const estimatedTime = getEstimatedFinishDate(form.service).toISOString()
      const payload: ScreenPayload = {
        id: cards[index]?.id ?? null,
        screen_id: tvId,
        customer_name: form.customerName,
        brand: form.brand,
        type: form.carType,
        year: form.year,
        license_plate: form.licensePlate,
        service: form.service,
        estimated_time: estimatedTime,
        status: 'Active',
      }

      const res = await fetch(apiUrl(`/api/screens/${tvId}/assign`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
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
      setIsLoading((previous) => ({ ...previous, [tvId]: false }))
    }
  }

  const handleRemove = async (index: number, resetForm?: () => void) => {
    const screenId = cards[index]?.screenId
    if (!screenId) return

    const confirm = await Swal.fire({
      title: 'Remove Display?',
      text: 'All active display records for this screen will be marked inactive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#f68b8b',
    })
    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(apiUrl(`/api/screens/${screenId}/remove`), {
        method: 'PATCH',
        headers: authHeaders(),
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
        updated[index] = {
          ...updated[index],
          id: null,
          customerName: '',
          brand: '',
          carType: '',
          year: '',
          service: '',
          licensePlate: '',
          estimatedTime: '',
          time: '-',
          status: 'Inactive',
        } as CardData
        return updated
      })
      resetForm?.()
    } catch {
      Swal.fire('Error', 'Failed to deactivate display.', 'error')
    }
  }

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [event.target.name]: event.target.value })

  const resetForm = () =>
    setForm({ customerName: '', brand: '', carType: '', year: '', service: '', licensePlate: '' })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.service && !isActive) return alert('Please select a service.')
    if (isActive) await onRemove(index, resetForm)
    else onDisplay(index, { ...form, estimatedTime, id: card.id, screenId: card.screenId })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Slot {index + 1}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{card.screenId}</p>
        </div>
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: 'Customer Name', name: 'customerName', placeholder: 'e.g. Andi Wijaya' },
            { label: 'Car Brand', name: 'brand', placeholder: 'e.g. Toyota' },
            { label: 'Type', name: 'carType', placeholder: 'e.g. Avanza' },
            { label: 'Year', name: 'year', placeholder: 'e.g. 2023' },
            { label: 'License Plate', name: 'licensePlate', placeholder: 'e.g. B 1234 CD' },
          ].map((field) => (
            <InputField
              key={field.name}
              label={field.label}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              disabled={isActive || isLoading}
            />
          ))}

          <SelectField
            label="Service"
            name="service"
            value={form.service}
            onChange={handleChange}
            options={services.map((service) => ({ label: service.label, value: service.value }))}
            disabled={isActive || isLoading}
          />
        </div>

        <div className="mt-4">
          <InputField label="Estimated Finish" value={estimatedTime} disabled readOnly />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ${
              isActive
                ? 'bg-rose-500 hover:bg-rose-600'
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
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
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
  placeholder,
  disabled = false,
  readOnly = false,
}: {
  label: string
  name?: string
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`h-11 w-full rounded-lg border px-3 text-sm text-gray-900 outline-none transition-all duration-200 ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
            : 'border-gray-300 bg-white placeholder:text-gray-400 hover:border-gray-400 focus:border-[#3847D1] focus:ring-4 focus:ring-[#3847D1]/10'
        }`}
      />
    </label>
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
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: { label: string; value: string }[]
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-11 w-full rounded-lg border px-3 text-sm text-gray-900 outline-none transition-all duration-200 ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
            : 'border-gray-300 bg-white hover:border-gray-400 focus:border-[#3847D1] focus:ring-4 focus:ring-[#3847D1]/10'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
