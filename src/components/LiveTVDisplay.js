import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import bgcard from '../assets/bgcard.png';
import trapoLogo from '../assets/LOGO_TRAPO.png';
/** Format tanggal agar mudah dibaca */
const formatDate = (dateString) => {
    if (!dateString)
        return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }
    catch {
        return dateString;
    }
};
export default function LiveTVDisplay({ data, index, onRemove, isTVOutput = false, }) {
    /** 🌑 EMPTY SLOT — tampilkan logo TRAPO dengan animasi lembut */
    if (!data || !data.customer_name) {
        return (_jsxs("div", { className: "absolute inset-0 w-screen h-screen flex items-center justify-center overflow-hidden animate-fadein", style: {
                backgroundImage: `url(${bgcard})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }, children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm" }), _jsx("img", { src: trapoLogo, alt: "TRAPO Logo", className: "relative z-10 w-[40vw] max-w-[420px] opacity-95 drop-shadow-[0_0_50px_rgba(56,71,209,0.8)] animate-pulse-slow" }), _jsx("style", { children: `
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
          ` })] }));
    }
    /** Font & layout setup */
    const carTitle = `${data.brand || ''} ${data.type || ''} ${data.year || ''}`.trim();
    const totalLength = carTitle.length;
    // Ganti bagian font-size dynamic:
    const carFontSize = (() => {
        if (totalLength > 25)
            return '40px';
        if (totalLength > 15)
            return '50px';
        return '60px';
    })();
    const labelStyle = {
        fontSize: '22px',
        color: '#f3f4f6',
        textShadow: '0 0 10px rgba(56,71,209,0.8), 0 0 14px rgba(255,255,255,0.5), 0 0 18px rgba(56,71,209,0.6)',
        letterSpacing: '0.15em',
    };
    const customerFont = '26px';
    const valueFont = '36px';
    const finishFont = '42px';
    return (_jsxs("div", { className: "absolute top-0 left-0 flex items-center justify-center animate-fadein", style: {
            width: '1366px',
            height: '768px',
            backgroundImage: `url(${bgcard})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" }), _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, transition: { duration: 0.7, ease: 'easeInOut' }, className: "relative z-10 flex flex-col justify-between items-center text-center text-white w-full h-full p-[6vh]", children: [!isTVOutput && (_jsx("button", { onClick: () => onRemove(index), className: "absolute top-6 right-8 z-20 p-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md", children: _jsx(X, { className: "h-5 w-5" }) })), _jsx(motion.p, { className: "font-semibold uppercase tracking-wide mb-4", style: {
                                fontSize: customerFont,
                                textShadow: '0 0 8px rgba(0,0,0,0.7)',
                            }, initial: { opacity: 0, y: -15 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, children: data.customer_name }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("p", { className: "uppercase mb-2 font-bold", style: labelStyle, children: "CAR TYPE" }), _jsxs("h2", { className: "font-extrabold text-white leading-tight text-center", style: {
                                        fontSize: carFontSize,
                                        textShadow: '0 0 12px rgba(56,71,209,0.8), 0 0 25px rgba(214,51,132,0.6), 0 0 40px rgba(0,0,0,0.9)',
                                        letterSpacing: '0.05em',
                                    }, children: [data.brand, " ", data.type, data.year && (_jsxs("span", { className: "text-gray-300 font-medium ml-2 text-[clamp(1rem,2vw,1.6rem)]", children: ["\u2022 ", data.year] }))] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[80vw] mt-10", children: [{ label: 'SERVICE TYPE', value: data.service }, { label: 'PLATE NUMBER', value: data.license_plate }].map(({ label, value }) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "bg-black/40 backdrop-blur-md border border-white/30 py-5 px-4 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]", children: [_jsx("p", { className: "uppercase mb-3 font-bold", style: labelStyle, children: label }), _jsx("p", { className: "font-bold text-white truncate", style: {
                                            fontSize: valueFont,
                                            textShadow: '0 0 10px rgba(0,0,0,0.8)',
                                        }, children: value || '-' })] }, label))) }), _jsxs("div", { className: "mt-12", children: [_jsx("p", { className: "uppercase mb-3 font-bold", style: labelStyle, children: "FINISH DATE" }), _jsx("p", { className: "text-white font-extrabold", style: {
                                        fontSize: finishFont,
                                        textShadow: '0 0 20px rgba(56,71,209,0.8), 0 0 30px rgba(214,51,132,0.5)',
                                    }, children: formatDate(data.estimated_time) })] }), _jsx("img", { src: trapoLogo, alt: "TRAPO Logo", className: "absolute bottom-8 right-10 w-[12vh] max-w-[220px] opacity-90 drop-shadow-[0_0_40px_rgba(56,71,209,0.7)] select-none pointer-events-none" })] }, data.customer_name || 'empty') })] }));
}
