import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwtHelper";
import { useState, useEffect } from "react";
export default function ProtectedRoute({ children }) {
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsAuthenticated(false);
                    setIsValidating(false);
                    return;
                }
                // Coba ambil user dari token
                const user = getUserFromToken();
                if (!user) {
                    // Token tidak valid, hapus dari localStorage
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setIsAuthenticated(false);
                }
                else {
                    // Token valid, periksa expiry jika ada
                    if (user.exp && user.exp < Math.floor(Date.now() / 1000)) {
                        // Token expired, hapus dari localStorage
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setIsAuthenticated(false);
                    }
                    else {
                        setIsAuthenticated(true);
                    }
                }
            }
            catch (error) {
                console.error("Error validating token:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsAuthenticated(false);
            }
            finally {
                setIsValidating(false);
            }
        };
        validateToken();
    }, []);
    // Tampilkan loading indicator saat validasi token
    if (isValidating) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-[#252432]", children: _jsx("div", { className: "text-white text-xl", children: "Loading..." }) }));
    }
    // Jika tidak terautentikasi, redirect ke halaman login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    // Jika terautentikasi, render children
    return _jsx(_Fragment, { children: children });
}
;
