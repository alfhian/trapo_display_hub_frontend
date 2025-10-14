import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwtHelper";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
