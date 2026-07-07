import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SidebarItem = ({ label, active = false, icon }) => {
    return (_jsxs("button", { className: `flex items-center space-x-4 px-4 py-2 text-left w-full rounded-lg transition-colors ${active
            ? 'bg-gray-700 text-white font-semibold'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`, children: [_jsx("span", { className: "text-lg", children: icon }), _jsx("span", { children: label })] }));
};
export default SidebarItem;
