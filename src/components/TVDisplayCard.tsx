import { X } from 'lucide-react'
import bgcard from '../assets/bgcard.png'
import trapoLogo from '../assets/LOGO_TRAPO.png'

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
  /** 🌑 EMPTY SLOT — tampilkan logo TRAPO dengan animasi */
  if (!data || !data.customer_name) {
    return (
      <div
        className="relative w-full aspect-video flex items-center justify-center overflow-hidden rounded-3xl animate-fadein"
        style={{
          backgroundImage: `url(${bgcard})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* LOGO TRAPO CENTER dengan animasi pulse lambat */}
        <img
          src={trapoLogo}
          alt="TRAPO Logo"
          className="relative z-10 w-[40vw] max-w-[420px] opacity-95 drop-shadow-[0_0_50px_rgba(56,71,209,0.8)] animate-pulse-slow"
        />

        {/* Animations */}
        <style>
          {`
            @keyframes pulse-slow {
              0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 40px rgba(56,71,209,0.4));
                opacity: 0.9;
              }
              50% {
                transform: scale(1.08);
                filter: drop-shadow(0 0 80px rgba(56,71,209,0.8));
                opacity: 1;
              }
            }
            .animate-pulse-slow {
              animation: pulse-slow 6s ease-in-out infinite;
            }

            @keyframes fadein {
              from { opacity: 0; transform: scale(0.98); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fadein {
              animation: fadein 0.8s ease-out forwards;
            }
          `}
        </style>
      </div>
    )
  }

  /** Font dan style setup */
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
  const labelFontSize = isTVOutput ? 'clamp(1rem,2vw,1.6rem)' : '1rem'
  const labelStyle = {
    fontSize: labelFontSize,
    color: '#f3f4f6',
    textShadow: '0 0 8px rgba(56,71,209,0.8), 0 0 12px rgba(255,255,255,0.4)',
    letterSpacing: '0.15em',
  }

  return (
    <div
      className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)] animate-fadein"
      style={{
        backgroundImage: `url(${bgcard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 border border-white/20 rounded-3xl shadow-inner" />

      {/* Remove Button */}
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
        className={`relative z-10 flex flex-col justify-between items-center h-full text-center ${sectionPad}`}
      >
        {/* Customer Name */}
        {data.customer_name && (
          <p
            className="text-white font-semibold uppercase tracking-wide drop-shadow-[0_0_5px_rgba(0,0,0,0.5)] mb-2 transition-all duration-500"
            style={{
              fontSize: smallText,
              textShadow: '0 0 8px rgba(0,0,0,0.6)',
            }}
          >
            {data.customer_name}
          </p>
        )}

        {/* Car Info */}
        <div className="transition-opacity duration-700">
          <p className="uppercase mb-1" style={labelStyle}>
            CAR TYPE
          </p>
          <h2
            className="font-extrabold text-white leading-tight"
            style={{
              fontSize: carFontSize,
              textShadow:
                '0 0 8px rgba(56,71,209,0.7), 0 0 20px rgba(214,51,132,0.5), 0 0 30px rgba(0,0,0,0.8)',
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

        {/* Service + Plate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4 transition-all duration-700">
          {[{ label: 'SERVICE TYPE', value: data.service }, { label: 'PLATE NUMBER', value: data.license_plate }].map(
            ({ label, value }) => (
              <div
                key={label}
                className="bg-black/40 backdrop-blur-md border border-white/30 rounded-2xl py-3 shadow-[inset_0_0_8px_rgba(255,255,255,0.1)]"
              >
                <p className="uppercase tracking-widest mb-2 font-bold" style={labelStyle}>
                  {label}
                </p>
                <p
                  className="font-bold text-white truncate px-1"
                  style={{
                    fontSize: isTVOutput ? 'clamp(1.8rem,4vw,2.8rem)' : '1.2rem',
                    textShadow: '0 0 6px rgba(0,0,0,0.7)',
                  }}
                >
                  {value || '-'}
                </p>
              </div>
            ),
          )}
        </div>

        {/* Estimated Finish */}
        <div className="mt-6 transition-all duration-700">
          <p className="uppercase tracking-widest mb-2 font-bold" style={labelStyle}>
            FINISH DATE
          </p>
          <p
            className="text-white font-extrabold"
            style={{
              fontSize: isTVOutput ? 'clamp(2.4rem,6vw,4rem)' : 'clamp(1.6rem,3vw,2.4rem)',
              textShadow:
                '0 0 10px rgba(56,71,209,0.6), 0 0 20px rgba(214,51,132,0.5)',
              letterSpacing: '0.02em',
            }}
          >
            {formatDate(data.estimated_time)}
          </p>
        </div>
      </div>

      {/* 🌟 TRAPO LOGO (watermark kanan bawah, diperbesar dan lebih terang) */}
      <img
        src={trapoLogo}
        alt="TRAPO Logo"
        className="absolute bottom-5 right-8 w-[13vh] max-w-[200px] opacity-95 drop-shadow-[0_0_30px_rgba(56,71,209,0.7)] select-none pointer-events-none transition-transform duration-700"
      />
    </div>
  )
}
