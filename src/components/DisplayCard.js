import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DisplayCard = ({ number, status, name, brand, type, service, licensePlate, // ✅ TAMBAHKAN INI
time, action, }) => {
    const isActive = status === 'Active';
    const statusColor = isActive ? 'text-green-600' : 'text-red-600';
    const statusIcon = isActive ? '✔' : '❌';
    const buttonStyle = isActive
        ? 'bg-red-600 text-white hover:bg-red-700'
        : 'border border-gray-400 text-gray-600 hover:bg-gray-100';
    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md flex flex-col gap-3", children: [_jsxs("div", { className: "flex items-center gap-4 mb-2", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600", children: number }), _jsxs("span", { className: `font-semibold ${statusColor}`, children: [statusIcon, " ", status] })] }), _jsxs("div", { className: "space-y-1 text-sm text-gray-700", children: [_jsxs("p", { children: ["Customer Name: ", name] }), _jsxs("p", { children: ["Car Brand: ", brand] }), _jsxs("p", { children: ["Type: ", type] }), _jsxs("p", { children: ["Service: ", service] }), _jsxs("p", { children: ["Licence Plate: ", licensePlate] }), " ", _jsxs("p", { children: ["Estimated Time: ", time] })] }), _jsx("button", { className: `mt-4 px-4 py-2 rounded ${buttonStyle}`, children: action })] }));
};
export default DisplayCard;
