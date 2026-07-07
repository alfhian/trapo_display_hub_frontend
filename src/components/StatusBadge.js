import { jsxs as _jsxs } from "react/jsx-runtime";
const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    const color = isActive ? 'text-green-600' : 'text-red-600';
    const icon = isActive ? '✔️' : '❌';
    return (_jsxs("span", { className: `text-sm font-semibold ${color}`, children: [icon, " ", status] }));
};
export default StatusBadge;
