import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import 'sweetalert2/dist/sweetalert2.min.css';
import { getServices } from '../config/services';
import { getEstimatedFinishDate } from '../utils/timeUtils';
export default function DisplayHubPage() {
    const [cards, setCards] = useState([]);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [isLoading, setIsLoading] = useState({});
    // 🔹 Fetch data awal
    const fetchScreens = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok)
                throw new Error('Failed to fetch screens');
            const data = await response.json();
            const mapped = data.map((s) => ({
                id: s.id,
                screenId: s.screen_id,
                customerName: s.customer_name ?? '',
                brand: s.brand ?? '',
                carType: s.type ?? '',
                year: s.year ?? '',
                service: s.service ?? '',
                licensePlate: s.license_plate ?? '',
                estimatedTime: s.estimated_time ?? '',
                time: s.estimated_time ?? '-',
                status: s.customer_name ? 'Active' : 'Inactive',
            }));
            setCards(mapped);
        }
        catch (e) {
            Swal.fire('Error', 'Failed to load display hub data.', 'error');
        }
    };
    useEffect(() => {
        fetchScreens();
    }, []);
    // 🔹 Assign Display
    const handleDisplay = async (index, form) => {
        const tvId = cards[index]?.screenId;
        if (!tvId)
            return;
        setIsLoading((p) => ({ ...p, [tvId]: true }));
        try {
            const token = localStorage.getItem('token');
            const estimatedTime = getEstimatedFinishDate(form.service).toISOString();
            const payload = {
                id: tvId,
                customer_name: form.customerName,
                brand: form.brand,
                type: form.carType,
                year: form.year,
                license_plate: form.licensePlate,
                service: form.service,
                estimated_time: estimatedTime,
                status: 'Active',
            };
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${tvId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok)
                throw new Error('Failed to assign');
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Customer data sent to TV display.',
                timer: 1500,
                showConfirmButton: false,
            });
            fetchScreens();
        }
        catch (err) {
            Swal.fire('Error', err instanceof Error ? err.message : 'Unknown error', 'error');
        }
        finally {
            setIsLoading((p) => ({ ...p, [tvId]: false }));
        }
    };
    // 🔹 Remove Display
    const handleRemove = async (index, resetForm) => {
        const tvId = cards[index]?.id;
        if (!tvId)
            return;
        const confirm = await Swal.fire({
            title: 'Remove Display?',
            text: 'This slot will be marked as inactive.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            confirmButtonColor: '#f68b8b',
        });
        if (!confirm.isConfirmed)
            return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${tvId}/remove`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok)
                throw new Error('Failed');
            Swal.fire({
                icon: 'success',
                title: 'Removed!',
                text: 'Display slot has been deactivated.',
                timer: 1200,
                showConfirmButton: false,
            });
            setCards((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], status: 'Inactive' };
                return updated;
            });
            resetForm?.();
        }
        catch {
            Swal.fire('Error', 'Failed to deactivate display.', 'error');
        }
    };
    const [sidebarWidth, setSidebarWidth] = useState(256);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Sidebar, { onWidthChange: setSidebarWidth }), _jsxs("main", { className: "transition-all duration-300 overflow-y-auto", style: { marginLeft: `${sidebarWidth}px` }, children: [_jsx(Navbar, { title: "Display Hub (Management)" }), _jsx("div", { className: "px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8", children: cards.map((card, index) => (_jsx(DisplayCard, { index: index, card: card, onDisplay: handleDisplay, onRemove: handleRemove, isLoading: !!isLoading[card.screenId] }, card.screenId))) })] })] }));
}
/* ----------------------------- Subcomponent ----------------------------- */
function DisplayCard({ index, card, onDisplay, onRemove, isLoading, }) {
    const [form, setForm] = useState({
        customerName: card.customerName,
        brand: card.brand,
        carType: card.carType,
        year: card.year,
        service: card.service,
        licensePlate: card.licensePlate,
    });
    const services = getServices();
    const isActive = card.status === 'Active';
    const estimatedTime = form.service ? getEstimatedFinishDate(form.service).toLocaleString() : '-';
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const resetForm = () => setForm({ customerName: '', brand: '', carType: '', year: '', service: '', licensePlate: '' });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.service)
            return alert('Please select a service.');
        if (isActive)
            await onRemove(index, resetForm);
        else
            onDisplay(index, {
                ...form, estimatedTime,
                id: '',
                screenId: ''
            });
    };
    return (_jsxs("div", { className: "rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center", children: [_jsxs("div", { className: "flex items-center justify-between w-full mb-4", children: [_jsxs("h3", { className: "text-sm font-semibold text-gray-700", children: ["Slot ", index + 1] }), _jsx("span", { className: `text-xs font-medium px-2 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`, children: isActive ? 'Active' : 'Inactive' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "w-full space-y-2", children: [[
                        { label: 'Customer Name', name: 'customerName' },
                        { label: 'Car Brand', name: 'brand' },
                        { label: 'Type', name: 'carType' },
                        { label: 'Year', name: 'year' },
                        { label: 'License Plate', name: 'licensePlate' },
                    ].map((f) => (_jsx(InputField, { label: f.label, name: f.name, value: form[f.name], onChange: handleChange, disabled: isActive || isLoading }, f.name))), _jsx(SelectField, { label: "Service", name: "service", value: form.service, onChange: handleChange, options: services.map((s) => ({ label: s.label, value: s.value })), disabled: isActive || isLoading }), _jsx(InputField, { label: "Estimated Time", value: estimatedTime, disabled: true, readOnly: true }), _jsxs("div", { className: "flex justify-between items-center pt-3", children: [_jsx("button", { type: "submit", disabled: isLoading, className: `px-8 py-2.5 rounded-full font-semibold text-white transition-all duration-300 shadow-sm ${isActive
                                    ? 'bg-[#f68b8b] hover:bg-[#f57b7b]'
                                    : 'bg-[#3847D1] hover:bg-[#2e3ab8]'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`, children: isLoading ? 'Processing...' : isActive ? 'Remove' : 'Display' }), isActive && (_jsx("a", { href: `/display/${card.screenId}`, target: "_blank", rel: "noopener noreferrer", className: "px-8 py-2.5 rounded-full text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 transition-all duration-300 shadow-sm", children: "View on TV" }))] })] })] }));
}
function InputField({ label, name, value, onChange, disabled = false, readOnly = false, }) {
    return (_jsxs("div", { className: "flex items-center justify-between gap-6 py-1", children: [_jsx("label", { className: "w-32 text-right font-semibold text-gray-800 text-sm", children: label }), _jsx("input", { type: "text", name: name, value: value, onChange: onChange, disabled: disabled, readOnly: readOnly, className: `flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'}` })] }));
}
function SelectField({ label, name, value, onChange, options, disabled = false, }) {
    return (_jsxs("div", { className: "flex items-center justify-between gap-6 py-1", children: [_jsx("label", { className: "w-32 text-right font-semibold text-gray-800 text-sm", children: label }), _jsxs("select", { name: name, value: value, onChange: onChange, disabled: disabled, className: `flex-1 border rounded-lg p-2 text-sm transition-all duration-300 ${disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100'}`, children: [_jsxs("option", { value: "", children: ["Select ", label] }), options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })] }));
}
