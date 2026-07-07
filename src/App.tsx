import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import DisplayHubPage from "./pages/DisplayHubPage";
import DisplayScreenPage from './pages/DisplayScreenPage'
import SettingsPage from "./pages/SettingsPage";
import './styles/Navbar.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Hanya bisa diakses kalau sudah login) */}
        /* ProtectedRoute */
        <Route
          path="/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}> <DashboardPage /> </ProtectedRoute>}
        />
        <Route
          path="/display-hub" element={<ProtectedRoute allowedRoles={["admin"]}> <DisplayHubPage /> </ProtectedRoute>}
        />
        <Route path="/display/:id" element={<DisplayScreenPage />} />
        <Route
        path="/settings" element={<ProtectedRoute allowedRoles={["admin"]}> <SettingsPage /> </ProtectedRoute>}
        />

        {/* Default Redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
