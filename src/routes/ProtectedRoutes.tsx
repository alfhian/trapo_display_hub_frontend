import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwtHelper";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

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
        } else {
          // Token valid, periksa expiry jika ada
          if (user.exp && user.exp < Math.floor(Date.now() / 1000)) {
            // Token expired, hapus dari localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
            setIsAuthorized(!allowedRoles?.length || allowedRoles.includes(user.role));
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [allowedRoles]);

  // Tampilkan loading indicator saat validasi token
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#252432]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Jika tidak terautentikasi, redirect ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Access restricted</h1>
          <p className="mt-2 text-sm text-gray-500">
            Akun ini tidak memiliki akses admin untuk halaman Display Hub.
          </p>
        </div>
      </div>
    );
  }

  // Jika terautentikasi, render children
  return <>{children}</>;
};
