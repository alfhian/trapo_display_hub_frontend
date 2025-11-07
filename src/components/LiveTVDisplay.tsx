import { motion, AnimatePresence } from 'framer-motion'
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

export default function LiveTVDisplay({
  data,
  index,
  onRemove,
  isTVOutput = false,
}: TVDisplayCardProps) {
  /** 🌑 EMPTY SLOT — tampilkan logo TRAPO dengan animasi lembut */
  if (!data || !data.customer_name) {
    return (
      <div
        className="absolute inset-0 w-screen h-screen flex items-center justify-center overflow-hidden animate-fadein"
        style={{
          backgroundImage: `url(${bgcard})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <img
          src={trapoLogo}
          alt="TRAPO Logo"
          className="relative z-10 w-[40vw] max-w-[420px] opacity-95 drop-shadow-[0_0_50px_rgba(56,71,209,0.8)] animate-pulse-slow"
        />
        <style>
          {`
            @keyframes pulse-slow {
              0%, 100% { transform: scale(1); opacity: 0.9; filter: drop-shadow(0 0 40px rgba(56,71,209,0.4)); }
              50% { transform: scale(1.08); opacity: 1; filter: drop-shadow(0 0 80px rgba(56,71,209,0.8)); }
            }
            .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

            @keyframes fadein {
              from { opacity: 0; transform: scale(0.98); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fadein { animation: fadein 0.8s ease-out forwards; }
          `}
        </style>
      </div>
    )
  }

  /** Font & layout setup */
  const carTitle = `${data.brand || ''} ${data.type || ''} ${data.year || ''}`.trim()
  const totalLength = carTitle.length

  const carFontSize = (() => {
    if (totalLength > 25) return 'clamp(2rem,5vw,4rem)'
    if (totalLength > 15) return 'clamp(3rem,7vw,5.5rem)'
    return 'clamp(3.5rem,10vw,6.5rem)'
  })()

  const labelStyle = {
    fontSize: 'clamp(1.4rem,2vw,2.2rem)',
    color: '#f3f4f6',
    textShadow:
      '0 0 10px rgba(56,71,209,0.8), 0 0 14px rgba(255,255,255,0.5), 0 0 18px rgba(56,71,209,0.6)',
    letterSpacing: '0.15em',
  }

  const customerFont = 'clamp(1.2rem,2.5vw,2rem)'
  const valueFont = 'clamp(2rem,5vw,3.6rem)'
  const finishFont = 'clamp(2.6rem,7vw,5rem)'

  return (
    <div
      className="absolute inset-0 w-screen h-screen overflow-hidden flex items-center justify-center animate-fadein"
      style={{
        backgroundImage: `url(${bgcard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      <AnimatePresence mode="wait">
        <motion.div
          key={data.customer_name || 'empty'}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="relative z-10 flex flex-col justify-between items-center text-center text-white w-full h-full p-[6vh]"
        >
          {/* ❌ Remove button (admin only, non-TV) */}
          {!isTVOutput && (
            <button
              onClick={() => onRemove(index)}
              className="absolute top-6 right-8 z-20 p-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* 🧍 Customer Name */}
          <motion.p
            className="font-semibold uppercase tracking-wide mb-4"
            style={{
              fontSize: customerFont,
              textShadow: '0 0 8px rgba(0,0,0,0.7)',
            }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {data.customer_name}
          </motion.p>

          {/* 🚗 Car Info */}
          <div className="flex flex-col items-center">
            <p className="uppercase mb-2 font-bold" style={labelStyle}>
              CAR TYPE
            </p>
            <h2
              className="font-extrabold text-white leading-tight text-center"
              style={{
                fontSize: carFontSize,
                textShadow:
                  '0 0 12px rgba(56,71,209,0.8), 0 0 25px rgba(214,51,132,0.6), 0 0 40px rgba(0,0,0,0.9)',
                letterSpacing: '0.05em',
              }}
            >
              {data.brand} {data.type}
              {data.year && (
                <span className="text-gray-300 font-medium ml-2 text-[clamp(1rem,2vw,1.6rem)]">
                  • {data.year}
                </span>
              )}
            </h2>
          </div>

          {/* 🧰 Service & Plate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[80vw] mt-10">
            {[{ label: 'SERVICE TYPE', value: data.service }, { label: 'PLATE NUMBER', value: data.license_plate }].map(
              ({ label, value }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-black/40 backdrop-blur-md border border-white/30 py-5 px-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"
                >
                  <p className="uppercase mb-3 font-bold" style={labelStyle}>
                    {label}
                  </p>
                  <p
                    className="font-bold text-white truncate"
                    style={{
                      fontSize: valueFont,
                      textShadow: '0 0 10px rgba(0,0,0,0.8)',
                    }}
                  >
                    {value || '-'}
                  </p>
                </motion.div>
              )
            )}
          </div>

          {/* 🕒 Finish Date */}
          <div className="mt-12">
            <p className="uppercase mb-3 font-bold" style={labelStyle}>
              FINISH DATE
            </p>
            <p
              className="text-white font-extrabold"
              style={{
                fontSize: finishFont,
                textShadow:
                  '0 0 20px rgba(56,71,209,0.8), 0 0 30px rgba(214,51,132,0.5)',
              }}
            >
              {formatDate(data.estimated_time)}
            </p>
          </div>

          {/* 💠 Watermark Logo */}
          <img
            src={trapoLogo}
            alt="TRAPO Logo"
            className="absolute bottom-8 right-10 w-[12vh] max-w-[220px] opacity-90 drop-shadow-[0_0_40px_rgba(56,71,209,0.7)] select-none pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
