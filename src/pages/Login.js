import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "/node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/LoginGlow.css";
import logoTrapo from "../assets/LOGO_TRAPO.png";
const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            Swal.fire("Oops!", "Please fill in all fields.", "warning");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            // --- TITIK DEBUGGING 1: Periksa status response ---
            console.log("Response Status:", response.status);
            console.log("Response OK:", response.ok);
            const data = await response.json();
            // --- TITIK DEBUGGING 2: Lihat SELURUH data dari backend ---
            console.log("Data from Backend:", data);
            if (response.ok) {
                // --- TITIK DEBUGGING 3: Periksa apakah token ada ---
                console.log("Token received:", data.token);
                // Simpan token yang diterima dari API
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                else {
                    console.error("Token not found in response!");
                }
                // Jika ada informasi user tambahan, simpan juga
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }
                // --- TITIK DEBUGGING 4: Pastikan kode mencapai sini ---
                console.log("Attempting to show success alert and navigate...");
                Swal.fire({
                    icon: "success",
                    title: `Welcome, ${data.user?.name || username}!`,
                    text: "Login successful.",
                    timer: 1000,
                    showConfirmButton: false,
                    willClose: () => {
                        console.log("SweetAlert closed, navigating to /dashboard...");
                        navigate("/dashboard");
                    },
                });
            }
            else {
                // Tangani pesan error dari API
                Swal.fire("Access Denied", data.message || "Invalid username or password.", "error");
            }
        }
        catch (error) {
            console.error('Login error:', error);
            Swal.fire("Error", "An error occurred during login. Please try again.", "error");
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "login-page min-h-screen flex items-center justify-center bg-[#252432]", children: _jsx("div", { className: "box", children: _jsx("div", { className: "login", children: _jsxs("form", { onSubmit: handleLogin, className: "loginBx", children: [_jsx("img", { src: logoTrapo, alt: "Trapo Logo", className: "h-10 mb-2 transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#45f3ff]" }), _jsx("input", { type: "text", placeholder: "Username", value: username, onChange: (e) => setUsername(e.target.value), required: true, disabled: isLoading }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true, disabled: isLoading }), _jsx("input", { type: "submit", value: isLoading ? "Signing in..." : "Sign in", disabled: isLoading }), _jsxs("div", { className: "copyright text-center mt-4 text-sm text-gray-400", children: [_jsx("a", { href: "#", children: "\u00A9 Trapo Indonesia 2025" }), _jsx(Link, { to: "/register" })] })] }) }) }) }));
};
export default Login;
