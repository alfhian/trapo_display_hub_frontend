import { motion, AnimatePresence } from 'framer-motion'
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
  const carTitle = `${data?.brand || ''} ${data?.type || ''} ${data?.year || ''}`.trim()
  const totalLength = carTitle.length

  const carFontSize = (() => {
    if (totalLength > 25)
      return isTVOutput ? 'clamp(2rem,5vw,4rem)' : 'clamp(1.8rem,4vw,3rem)'
    if (totalLength > 15)
      return isTVOutput ? 'clamp(3rem,7vw,5rem)' : 'clamp(2.2rem,5vw,3.5rem)'
    return isTVOutput ? 'clamp(3.5rem,9vw,6rem)' : 'clamp(2.6rem,7vw,4.5rem)'
  })()

  const smallText = isTVOutput ? 'clamp(1rem,1.8vw,1.4rem)' : '1rem'
  const labelFont = isTVOutput ? 'clamp(1.4rem,2vw,2rem)' : '1.2rem' // 🔥 label lebih besar

  return (
    <div
      className="absolute inset-0 w-screen h-screen overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgcard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      <AnimatePresence mode="wait">
        <motion.div
          key={data?.customer_name || 'empty'}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`relative z-10 flex flex-col justify-between items-center text-center text-white ${
            isTVOutput ? 'p-[5vh]' : 'p-12'
          } w-full h-full`}
        >
          {!isTVOutput && (
            <button
              onClick={() => onRemove(index)}
              className="absolute top-5 right-5 z-20 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md"
              title="Remove this display"
            >
              <X className="h-6 w-6" />
            </button>
          )}

          {data?.customer_name && (
            <motion.p
              className="font-semibold uppercase tracking-wide drop-shadow-[0_0_5px_rgba(0,0,0,0.6)]"
              style={{ fontSize: smallText }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {data.customer_name}
            </motion.p>
          )}

          {/* CAR TYPE */}
          <div className="flex flex-col items-center mt-auto">
            <p
              className="text-gray-200 uppercase font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] mb-2"
              style={{ fontSize: labelFont, letterSpacing: '0.1em' }}
            >
              CAR TYPE
            </p>
            <h2
              className="font-extrabold text-white leading-tight text-center"
              style={{
                fontSize: carFontSize,
                textShadow:
                  '0 0 10px rgba(56,71,209,0.8), 0 0 25px rgba(214,51,132,0.5), 0 0 40px rgba(0,0,0,0.9)',
                letterSpacing: '0.05em',
              }}
            >
              {data?.brand || '—'} {data?.type || ''}
              {data?.year && (
                <span className="text-gray-300 font-medium ml-2 text-[clamp(1rem,2vw,1.6rem)]">
                  • {data.year}
                </span>
              )}
            </h2>
          </div>

          {/* SERVICE TYPE + PLATE NUMBER */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-[80vw] mt-12">
            {[
              { label: 'SERVICE TYPE', value: data?.service || '—' },
              { label: 'PLATE NUMBER', value: data?.license_plate || '—' },
            ].map(({ label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/40 backdrop-blur-md border border-white/30 rounded-xl py-6 px-3 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"
              >
                <p
                  className="uppercase text-gray-200 font-semibold tracking-widest mb-2"
                  style={{ fontSize: labelFont }}
                >
                  {label}
                </p>
                <p
                  className="font-bold text-white truncate px-1"
                  style={{
                    fontSize: isTVOutput ? 'clamp(2rem,4vw,3rem)' : '1.4rem',
                    textShadow: '0 0 8px rgba(0,0,0,0.8)',
                  }}
                >
                  {value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* FINISH DATE */}
          <motion.div
            className="mt-10 mb-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p
              className="uppercase text-gray-200 font-bold tracking-widest mb-2"
              style={{ fontSize: labelFont }}
            >
              FINISH DATE
            </p>
            <p
              className="font-extrabold text-white"
              style={{
                fontSize: isTVOutput
                  ? 'clamp(3rem,8vw,5rem)'
                  : 'clamp(1.6rem,3vw,2.4rem)',
                textShadow:
                  '0 0 15px rgba(56,71,209,0.7), 0 0 30px rgba(214,51,132,0.4)',
              }}
            >
              {formatDate(data?.estimated_time)}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
