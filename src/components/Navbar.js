import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
const Navbar = ({ title }) => {
    const [userName, setUserName] = useState('Administrator');
    useEffect(() => {
        const n = localStorage.getItem('userName');
        if (n)
            setUserName(n);
    }, []);
    return (_jsxs("header", { className: "sticky top-0 z-40 w-full h-[48px] flex justify-between items-center\n                 px-5 bg-white/90 backdrop-blur-md border-b border-gray-200", children: [_jsx("h4", { className: "text-[25px] font-medium text-gray-800", children: title }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FaUserCircle, { className: "text-lg text-gray-600" }), _jsxs("span", { className: "text-sm text-gray-700", children: [_jsx("span", { className: "text-gray-500", children: "Welcome, " }), _jsx("span", { className: "font-medium text-gray-900", children: userName })] })] }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-[1.5px] bg-gray-100" })] }));
};
export default Navbar;
