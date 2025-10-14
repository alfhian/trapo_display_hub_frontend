import React from 'react'
import { X } from 'lucide-react'
import bgcard from '../assets/bgcard.png'

const formatDate = (dateString: string): string => {
  if (!dateString || dateString === '-') return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch (error) {
    return dateString
  }
}

type TVDisplayCardProps = {
  data: {
    customerName: string
    brand: string
    carType: string
    service: string
    licensePlate: string
    status: string
    time: string
  } | null
  index: number
  onRemove: (index: number) => void
}

function TVDisplayCard({ data, index, onRemove }: TVDisplayCardProps) {
  if (!data) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-500 rounded-3xl">
        {index + 1}
      </div>
    )
  }

  return (
    <div
      className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url(${bgcard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 🔹 Glow frame */}
      <div className="absolute inset-0 border border-white/20 rounded-3xl shadow-inner"></div>

      {/* 🔹 Tombol Close */}
      <button
        onClick={() => onRemove(index)}
        className="absolute top-4 right-4 z-20 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md"
        title="Remove this display"
      >
        <X className="h-4 w-4" />
      </button>

      {/* 🔹 Konten */}
      <div className="relative z-10 flex flex-col justify-between items-center h-full text-center px-8 py-8">
        {/* CAR TYPE */}
        <div>
          <p className="text-base md:text-lg font-light text-gray-200 uppercase tracking-[0.25em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
            CAR TYPE
          </p>
          <h2
            className="font-extrabold text-white leading-tight"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5rem)',
              textShadow: `
                0 0 10px rgba(56, 71, 209, 0.7),
                0 0 25px rgba(214, 51, 132, 0.5),
                0 0 50px rgba(0,0,0,0.9)
              `,
              letterSpacing: '1px',
            }}
          >
            {data.brand} {data.carType}
          </h2>
        </div>

        {/* SERVICE & LICENSE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <div className="bg-black/40 backdrop-blur-md border border-white/30 rounded-2xl py-3 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">
            <p className="text-sm uppercase text-gray-300 tracking-widest mb-1">
              Service Type
            </p>
            <p
              className="text-3xl font-bold text-white"
              style={{
                textShadow: '0 0 8px rgba(0,0,0,0.7)',
              }}
            >
              {data.service}
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/30 rounded-2xl py-3 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">
            <p className="text-sm uppercase text-gray-300 tracking-widest mb-1">
              Licence Plate
            </p>
            <p
              className="text-3xl font-bold text-white"
              style={{
                textShadow: '0 0 8px rgba(0,0,0,0.7)',
              }}
            >
              {data.licensePlate}
            </p>
          </div>
        </div>

        {/* FINISH DATE */}
        <div className="mt-4">
          <p className="text-sm uppercase text-gray-300 tracking-widest mb-2">
            Finish Date
          </p>
          <p
            className="text-white font-extrabold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              textShadow: `
                0 0 12px rgba(56, 71, 209, 0.7),
                0 0 30px rgba(214, 51, 132, 0.5)
              `,
              letterSpacing: '0.03em',
            }}
          >
            {formatDate(data.time)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TVDisplayCard
