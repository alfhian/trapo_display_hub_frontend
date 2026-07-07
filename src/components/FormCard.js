import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
function calculateEstimatedTime(start, service) {
    const s = service.toLowerCase();
    if (s.includes("carmat"))
        return new Date(start.getTime() + 30 * 60000).toLocaleString();
    if (s.includes("dashcam"))
        return new Date(start.getTime() + 60 * 60000).toLocaleString();
    if (s.includes("interior"))
        return new Date(start.getTime() + 180 * 60000).toLocaleString();
    if (s.includes("quick shield"))
        return new Date(start.getTime() + 1 * 24 * 60 * 60000).toLocaleString();
    if (s.includes("pro") || s.includes("diamond"))
        return new Date(start.getTime() + 3 * 24 * 60 * 60000).toLocaleString();
    if (s.includes("ppf"))
        return (new Date(start.getTime() + 5 * 24 * 60 * 60000).toLocaleString() +
            " – " +
            new Date(start.getTime() + 7 * 24 * 60 * 60000).toLocaleString());
    return "-";
}
export default function FormCard({ index, initialData, onDisplay, onRemove, }) {
    const [form, setForm] = useState({
        customerName: initialData?.customerName || "",
        brand: initialData?.brand || "",
        carType: initialData?.carType || "",
        service: initialData?.service || "",
        licensePlate: initialData?.licensePlate || "", // ✅ TAMBAHKAN INI
    });
    useEffect(() => {
        if (initialData) {
            setForm({
                customerName: initialData.customerName,
                brand: initialData.brand,
                carType: initialData.carType,
                service: initialData.service,
                licensePlate: initialData.licensePlate, // ✅ TAMBAHKAN INI
            });
        }
        else {
            setForm({ customerName: "", brand: "", carType: "", service: "", licensePlate: "" }); // ✅ TAMBAHKAN INI
        }
    }, [initialData]);
    const isActive = !!initialData;
    const estimatedTime = form.service ? calculateEstimatedTime(new Date(), form.service) : "-";
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.service) {
            alert("Silakan pilih jenis layanan terlebih dahulu.");
            return;
        }
        if (isActive) {
            onRemove(index);
        }
        else {
            onDisplay(index, form);
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600", children: index + 1 }), _jsx("div", { className: "flex items-center gap-2", children: isActive ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "text-green-500 h-4 w-4" }), _jsx("span", { className: "text-green-600 font-medium", children: "Active" })] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "text-red-500 h-4 w-4" }), _jsx("span", { className: "text-red-600 font-medium", children: "Inactive" })] })) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-sm text-gray-700", children: [[
                        { label: "Customer Name", name: "customerName" },
                        { label: "Car Brand", name: "brand" },
                        { label: "Car Type", name: "carType" },
                    ].map((field) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "font-semibold text-gray-700", children: field.label }), _jsx("input", { type: "text", name: field.name, value: form[field.name], onChange: handleChange, className: `w-full border rounded-md p-2 text-sm transition-all duration-300 ease-in-out ${isActive
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100"}`, required: true, disabled: isActive })] }, field.name))), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "font-semibold text-gray-700", children: "License Plate" }), _jsx("input", { type: "text", name: "licensePlate", value: form.licensePlate, onChange: handleChange, className: `w-full border rounded-md p-2 text-sm transition-all duration-300 ease-in-out ${isActive
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100"}`, required: true, disabled: isActive })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "font-semibold text-gray-700", children: "Service" }), _jsxs("select", { name: "service", value: form.service, onChange: handleChange, className: `w-full border rounded-md p-2 text-sm transition-all duration-300 ${isActive
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100"}`, required: true, disabled: isActive, children: [_jsx("option", { value: "", children: "Pilih layanan" }), _jsx("option", { value: "Instalasi Carmat", children: "Instalasi Carmat" }), _jsx("option", { value: "Instalasi Dashcam", children: "Instalasi Dashcam" }), _jsx("option", { value: "Coating Quick Shield", children: "Coating Quick Shield" }), _jsx("option", { value: "Coating Pro", children: "Coating Pro" }), _jsx("option", { value: "Coating Diamond", children: "Coating Diamond" }), _jsx("option", { value: "PPF", children: "PPF" }), _jsx("option", { value: "Interior Cleaning/Detailing", children: "Interior Cleaning/Detailing" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "font-semibold text-gray-700", children: "Estimated Time" }), _jsx("input", { type: "text", value: estimatedTime, disabled: true, className: "w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 text-sm" })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: `mt-3 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-300 shadow-sm ${isActive
                                ? "bg-red-400 hover:bg-red-500 active:scale-95"
                                : "bg-blue-500 hover:bg-blue-600 active:scale-95"}`, children: isActive ? "🗑 Remove" : "📺 Display" }) })] })] }));
}
