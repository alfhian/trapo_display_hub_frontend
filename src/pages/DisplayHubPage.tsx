import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

type CardData = {
  name: string
  brand: string
  type: string
  service: string
  status: string
  time: string
} | null

function DisplayHubPage() {
  const [cards, setCards] = useState<CardData[]>([null, null, null, null])

  const handleDisplay = (
    index: number,
    formData: { customerName: string; brand: string; carType: string; service: string }
  ) => {
    const updated = [...cards]
    updated[index] = {
      name: formData.customerName,
      brand: formData.brand,
      type: formData.carType,
      service: formData.service,
      status: 'Active',
      time: new Date().toLocaleString(),
    }
    setCards(updated)
  }

  const handleRemove = (index: number) => {
    const updated = [...cards]
    updated[index] = null
    setCards(updated)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 max-h-screen overflow-y-scroll">
        <Navbar title="Display Hub" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md w-full relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
              {index + 1}
              </div>

                <span className={`font-semibold ${card ? 'text-green-600' : 'text-red-600'}`}>
                  {card ? '✔ Active' : '❌ Inactive'}
                </span>
              </div>

              {/* Content */}
              {card ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Customer Name:</span>
                    <span>{card.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Car Brand:</span>
                    <span>{card.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Car Type:</span>
                    <span>{card.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{card.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Time:</span>
                    <span>{card.time}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRemove(index)}
                      className="mt-4 px-4 py-2 rounded text-white"
                      style={{ backgroundColor: '#F68B8B' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <FormCard index={index} onDisplay={handleDisplay} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function FormCard({
  index,
  onDisplay,
}: {
  index: number
  onDisplay: (index: number, formData: { customerName: string; brand: string; carType: string; service: string }) => void
}) {
  const [form, setForm] = useState({
    customerName: '',
    brand: '',
    carType: '',
    service: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDisplay(index, form)
    setForm({ customerName: '', brand: '', carType: '', service: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-700">
      {[
        { label: 'Customer Name', name: 'customerName' },
        { label: 'Car Brand', name: 'brand' },
        { label: 'Car Type', name: 'carType' },
        { label: 'Service', name: 'service' },
      ].map((field) => (
        <div key={field.name} className="flex items-center justify-between gap-4">
          <label className="w-40 font-medium">{field.label}:</label>
          <input
            type="text"
            name={field.name}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-md p-2"
            required
          />
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded text-white"
          style={{ backgroundColor: '#7883FF' }}
        >
          Display
        </button>
      </div>
    </form>
  )
}

export default DisplayHubPage
