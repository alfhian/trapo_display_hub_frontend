import { X } from 'lucide-react'
import bgcard from '../assets/bgcard.png'

/** Format tanggal agar mudah dibaca */
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
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
    customer_name: string
    brand: string
    type: string
    year?: string
    service: string
    license_plate: string
    status: string
    estimated_time: string
  } | null
  index: number
  onRemove: (index: number) => void
  isTVOutput?: boolean
}

export default function TVDisplayCard({
  data,
  index,
  onRemove,
  isTVOutput = false,
}: TVDisplayCardProps) {
  // 1️⃣ Empty slot view
  if (!data) {
    return (
      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-3xl text-3xl font-bold text-gray-500">
        {index + 1}
      </div>
    )
  }

  // 2️⃣ Responsive font logic
  const carTitle = `${data.brand || ''} ${data.type || ''} ${data.year || ''}`.trim()
  const totalLength = carTitle.length

  const carFontSize = (() => {
    if (totalLength > 25)
      return isTVOutput ? 'clamp(2.2rem,6vw,4rem)' : 'clamp(1.8rem,4vw,3rem)'
    if (totalLength > 15)
      return isTVOutput ? 'clamp(3rem,8vw,5rem)' : 'clamp(2.2rem,5vw,3.5rem)'
    return isTVOutput ? 'clamp(3.5rem,10vw,6rem)' : 'clamp(2.6rem,7vw,4.5rem)'
  })()

  const smallText = isTVOutput ? 'clamp(1rem,1.8vw,1.4rem)' : '1rem'
  const sectionPad = isTVOutput ? 'px-12 py-12' : 'px-6 py-6'

  // 3️⃣ UI layout
  return (
    <div
      className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)]"
      style={{
        backgroundImage: `url(${bgcard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay glow */}
      <div className="absolute inset-0 border border-white/20 rounded-3xl shadow-inner" />

      {/* Remove button */}
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
      <div className={`relative z-10 flex flex-col justify-between items-center h-full text-center ${sectionPad}`}>
        {/* Customer Name */}
        {data.customer_name && (
          <p
            className="text-white font-semibold uppercase tracking-wide drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] mb-2"
            style={{
              fontSize: smallText,
              textShadow: '0 0 8px rgba(0,0,0,0.6)',
            }}
          >
            {data.customer_name}
          </p>
        )}

        {/* Car Brand + Type + Year */}
        <div>
          <p className="text-xs md:text-sm text-gray-300 uppercase tracking-[0.25em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] mb-1">
            CAR TYPE
          </p>
          <h2
            className="font-extrabold text-white leading-tight"
            style={{
              fontSize: carFontSize,
              textShadow:
                '0 0 8px rgba(56,71,209,0.6), 0 0 20px rgba(214,51,132,0.4), 0 0 30px rgba(0,0,0,0.8)',
              letterSpacing: '0.5px',
            }}
          >
            {data.brand} {data.type}
            {data.year && (
              <span className="text-gray-300 font-medium ml-2 text-[1rem] md:text-[1.4rem]">
                • {data.year}
              </span>
            )}
          </h2>
        </div>

        {/* Service & License */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-4">
          {[
            { label: 'Service Type', value: data.service },
            { label: 'Plate Number', value: data.license_plate },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-black/40 backdrop-blur-md border border-white/30 rounded-2xl py-2.5 shadow-[inset_0_0_8px_rgba(255,255,255,0.1)]"
            >
              <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">{label}</p>
              <p
                className="font-bold text-white truncate px-1"
                style={{
                  fontSize: isTVOutput ? 'clamp(1.6rem,4vw,2.6rem)' : '1.2rem',
                  textShadow: '0 0 6px rgba(0,0,0,0.7)',
                }}
              >
                {value || '-'}
              </p>
            </div>
          ))}
        </div>

        {/* Estimated Finish */}
        <div className="mt-3">
          <p className="text-xs uppercase text-gray-300 tracking-widest mb-1">Finish Date</p>
          <p
            className="text-white font-extrabold"
            style={{
              fontSize: isTVOutput
                ? 'clamp(2rem,6vw,3.5rem)'
                : 'clamp(1.4rem,3vw,2.2rem)',
              textShadow:
                '0 0 10px rgba(56,71,209,0.6), 0 0 20px rgba(214,51,132,0.4)',
              letterSpacing: '0.02em',
            }}
          >
            {formatDate(data.estimated_time)}
          </p>
        </div>
      </div>
    </div>
  )
}
