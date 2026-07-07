import { jsx as _jsx } from "react/jsx-runtime";
import Select from 'react-select';
const options = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
];
export default function RoleSelect({ role, setRole }) {
    return (_jsx(Select, { options: options, value: options.find(opt => opt.value === role), onChange: (opt) => setRole(opt?.value ?? null), placeholder: "Pilih Role", className: 'w-full py-1 px-2 bg-white rounded-full', isClearable: true }));
}
