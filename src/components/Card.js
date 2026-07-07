import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const Card = ({ number, status, date }) => {
    const isActive = status === 'Active';
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true);
        const timeout = setTimeout(() => setAnimate(false), 600);
        return () => clearTimeout(timeout);
    }, [status]);
    return (_jsxs("div", { className: `bg-white p-4 rounded-lg shadow-md flex items-center gap-4 transition-all duration-500 ease-out ${animate ? 'scale-[1.02] shadow-lg' : ''}`, children: [_jsx("div", { className: "h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600", children: number }), _jsxs("div", { className: "flex flex-col transition-colors duration-300", children: [_jsx("span", { className: `font-semibold transition-colors duration-300 ${isActive ? 'text-green-600' : 'text-red-600'}`, children: isActive ? '✔ Active' : '❌ Inactive' }), _jsxs("span", { className: "text-sm text-gray-600", children: ["Estimated Time: ", isActive ? date : '-'] })] })] }));
};
export default Card;
