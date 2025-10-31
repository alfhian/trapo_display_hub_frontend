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
  } catch {
    return dateString
  }
}

type TVDisplayCardProps = {
  data: {
    customerName: string
    brand: string
    carType: string
    year?: string
    service: string
    licensePlate: string
    status: string
    time: string
  } | null
  index: number
  onRemove: (index: number) => void
  isTVOutput?: boolean
}

function TVDisplayCard({ data, index, onRemove, isTVOutput = false }: TVDisplayCardProps) {
  if (!data) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-2xl md:text-3xl font-bold text-gray-500 rounded-3xl">
        {index + 1}
      </div>
    )
  }

  // Hitung panjang teks brand + type + year → kecilkan font jika terlalu panjang
  const nameLength = `${data.brand} ${data.carType} ${data.year || ''}`.length
  const dynamicFontSize =
    nameLength > 26
      ? isTVOutput
        ? 'clamp(2.8rem, 8vw, 5rem)'
        : 'clamp(2.2rem, 5vw, 3.5rem)'
      : isTVOutput
      ? 'clamp(3.5rem, 10vw, 6.5rem)'
      : 'clamp(2.6rem, 8vw, 4.5rem)'

  return (
    <div
      className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url(${bgcard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glow frame */}
      <div className="absolute inset-0 border border-white/20 rounded-3xl shadow-inner"></div>

      {/* Remove button (hidden on TV mode) */}
      {!isTVOutput && (
        <button
          onClick={() => onRemove(index)}
          className="absolute top-3 right-3 z-20 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md"
          title="Remove this display"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col justify-between items-center h-full text-center ${
          isTVOutput ? 'px-12 py-12' : 'px-6 py-6'
        }`}
      >
        {/* CUSTOMER NAME */}
        <div className="mb-2">
          <p
            className="text-white font-semibold uppercase tracking-wide drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
            style={{
              fontSize: isTVOutput ? 'clamp(1.2rem, 2vw, 1.8rem)' : '1rem',
              textShadow: '0 0 10px rgba(0,0,0,0.6)',
            }}
          >
            {data.customerName}
          </p>
        </div>

        {/* CAR TYPE + YEAR */}
        <div>
          <p className="text-sm md:text-base font-light text-gray-200 uppercase tracking-[0.25em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] mb-1">
            CAR TYPE
          </p>
          <h2
            className="font-extrabold text-white leading-tight"
            style={{
              fontSize: dynamicFontSize,
              textShadow:
                '0 0 8px rgba(56,71,209,0.6), 0 0 18px rgba(214,51,132,0.4), 0 0 30px rgba(0,0,0,0.8)',
              letterSpacing: '0.5px',
            }}
          >
            {data.brand} {data.carType}
            {data.year && (
              <span className="text-gray-300 font-medium ml-2 text-[1.2rem] md:text-[1.6rem]">
                • {data.year}
              </span>
            )}
          </h2>
        </div>

        {/* SERVICE & LICENSE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-4">
          {[
            { label: 'Service Type', value: data.service },
            { label: 'Plate Number', value: data.licensePlate },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-black/40 backdrop-blur-md border border-white/30 rounded-2xl py-2.5 shadow-[inset_0_0_8px_rgba(255,255,255,0.1)]"
            >
              <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">
                {item.label}
              </p>
              <p
                className="font-bold text-white truncate px-1"
                style={{
                  fontSize: isTVOutput
                    ? 'clamp(1.6rem, 4vw, 2.8rem)'
                    : '1.25rem',
                  textShadow: '0 0 6px rgba(0,0,0,0.7)',
                }}
              >
                {item.value || '-'}
              </p>
            </div>
          ))}
        </div>

        {/* FINISH DATE */}
        <div className="mt-3">
          <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">
            Finish Date
          </p>
          <p
            className="text-white font-extrabold"
            style={{
              fontSize: isTVOutput
                ? 'clamp(2rem, 6vw, 3.5rem)'
                : 'clamp(1.4rem, 3vw, 2.2rem)',
              textShadow:
                '0 0 10px rgba(56,71,209,0.6), 0 0 20px rgba(214,51,132,0.4)',
              letterSpacing: '0.02em',
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
