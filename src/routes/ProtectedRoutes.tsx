import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwtHelper";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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
        const user = getUserFromToken(token);
        
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
  }, []);

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

  // Jika terautentikasi, render children
  return <>{children}</>;
};