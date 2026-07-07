import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../styles/RegisterGlow.css";
import logoTrapo from "../assets/LOGO_TRAPO.png";
const Register = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState(null);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!name || !role || !password) {
            Swal.fire("Oops!", "Silakan isi semua field!", "warning");
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", {
                name,
                userid: name,
                password,
                role,
                is_active: true,
                created_at: new Date().toISOString(),
                created_by: name,
            });
            if (!res.data.success) {
                throw new Error(res.data.message || "Registrasi gagal");
            }
            Swal.fire({
                icon: "success",
                title: "Registrasi berhasil!",
                text: "Silakan login untuk melanjutkan.",
                timer: 1500,
                showConfirmButton: false,
            });
            setTimeout(() => navigate("/"), 1500);
        }
        catch (err) {
            Swal.fire("Error", err?.response?.data?.message || "Registrasi gagal, silakan coba lagi.", "error");
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogin = () => navigate("/");
    return (_jsx("div", { className: "register-page min-h-screen flex items-center justify-center", children: _jsx("div", { className: "box", children: _jsxs("div", { className: "form w-[70%]", children: [_jsx("img", { src: logoTrapo, alt: "Trapo Logo" }), error && _jsx("div", { className: "text-red-400 text-sm", children: error }), _jsxs("form", { onSubmit: handleRegister, className: "flex flex-col gap-4 w-full", children: [_jsx("input", { type: "text", placeholder: "Nama Lengkap", value: name, onChange: (e) => setName(e.target.value), required: true }), _jsxs("select", { value: role || "", onChange: (e) => setRole(e.target.value), required: true, children: [_jsx("option", { value: "", disabled: true, children: "Pilih Role" }), _jsx("option", { value: "admin", children: "Admin" }), _jsx("option", { value: "staff", children: "Staff" }), _jsx("option", { value: "viewer", children: "Viewer" })] }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), _jsx("button", { type: "submit", disabled: loading, children: loading ? "Loading..." : "Register" }), _jsxs("div", { className: "bottom-text text-center", children: ["Sudah punya akun?", " ", _jsx("span", { onClick: handleLogin, children: "Sign in" })] })] })] }) }) }));
};
export default Register;
