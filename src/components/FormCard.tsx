import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type CardData = {
  customerName: string;
  brand: string;
  carType: string;
  service: string;
  licensePlate: string;
  status?: string;
  time?: string;
} | null;

function calculateEstimatedTime(start: Date, service: string): string {
  const s = service.toLowerCase();

  if (s.includes("carmat")) return new Date(start.getTime() + 30 * 60000).toLocaleString();
  if (s.includes("dashcam")) return new Date(start.getTime() + 60 * 60000).toLocaleString();
  if (s.includes("interior")) return new Date(start.getTime() + 180 * 60000).toLocaleString();
  if (s.includes("quick shield"))
    return new Date(start.getTime() + 1 * 24 * 60 * 60000).toLocaleString();
  if (s.includes("pro") || s.includes("diamond"))
    return new Date(start.getTime() + 3 * 24 * 60 * 60000).toLocaleString();
  if (s.includes("ppf"))
    return (
      new Date(start.getTime() + 5 * 24 * 60 * 60000).toLocaleString() +
      " – " +
      new Date(start.getTime() + 7 * 24 * 60 * 60000).toLocaleString()
    );
  return "-";
}

export default function FormCard({
  index,
  initialData,
  onDisplay,
  onRemove,
}: {
  index: number;
  initialData: CardData;
  onDisplay: (
    index: number,
    formData: { customerName: string; brand: string; carType: string; service: string; licensePlate: string } // ✅ TAMBAHKAN licensePlate DI SINI
  ) => void;
  onRemove: (index: number) => void;
}) {
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
    } else {
      setForm({ customerName: "", brand: "", carType: "", service: "", licensePlate: "" }); // ✅ TAMBAHKAN INI
    }
  }, [initialData]);

  const isActive = !!initialData;
  const estimatedTime = form.service ? calculateEstimatedTime(new Date(), form.service) : "-";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service) {
      alert("Silakan pilih jenis layanan terlebih dahulu.");
      return;
    }
    if (isActive) {
      onRemove(index);
    } else {
      onDisplay(index, form);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
          {index + 1}
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <CheckCircle className="text-green-500 h-4 w-4" />
              <span className="text-green-600 font-medium">Active</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500 h-4 w-4" />
              <span className="text-red-600 font-medium">Inactive</span>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
        {[
          { label: "Customer Name", name: "customerName" },
          { label: "Car Brand", name: "brand" },
          { label: "Car Type", name: "carType" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-sm transition-all duration-300 ease-in-out ${
                isActive
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100"
              }`}
              required
              disabled={isActive}
            />
          </div>
        ))}

        {/* ✅ TAMBAHKAN INPUT FIELD UNTUK LICENSE PLATE */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">License Plate</label>
          <input
            type="text"
            name="licensePlate"
            value={form.licensePlate}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 text-sm transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100"
            }`}
            required
            disabled={isActive}
          />
        </div>

        {/* Service */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Service</label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className={`w-full border rounded-md p-2 text-sm transition-all duration-300 ${
              isActive
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring focus:ring-blue-100"
            }`}
            required
            disabled={isActive}
          >
            <option value="">Pilih layanan</option>
            <option value="Instalasi Carmat">Instalasi Carmat</option>
            <option value="Instalasi Dashcam">Instalasi Dashcam</option>
            <option value="Coating Quick Shield">Coating Quick Shield</option>
            <option value="Coating Pro">Coating Pro</option>
            <option value="Coating Diamond">Coating Diamond</option>
            <option value="PPF">PPF</option>
            <option value="Interior Cleaning/Detailing">Interior Cleaning/Detailing</option>
          </select>
        </div>

        {/* Estimated Time */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-gray-700">Estimated Time</label>
          <input
            type="text"
            value={estimatedTime}
            disabled
            className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 text-sm"
          />
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`mt-3 px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-300 shadow-sm ${
              isActive
                ? "bg-red-400 hover:bg-red-500 active:scale-95"
                : "bg-blue-500 hover:bg-blue-600 active:scale-95"
            }`}
          >
            {isActive ? "🗑 Remove" : "📺 Display"}
          </button>
        </div>
      </form>
    </div>
  );
}