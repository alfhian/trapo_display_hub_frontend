import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import DisplayHubPage from "./pages/DisplayHubPage";
import SettingsPage from "./pages/SettingsPage";
import TVOutputPage from "./pages/TVOutputPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Hanya bisa diakses kalau sudah login) */}
        <Route
          path="/dashboard" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>
          }
        />
        <Route
          path="/display-hub" element={<ProtectedRoute> <DisplayHubPage /> </ProtectedRoute>
          }
        />
        <Route
          path="/display/:screenId" element={<ProtectedRoute> {/* <TVOutputPage /> */} </ProtectedRoute>
          }
        />
        <Route
        path="/settings" element={<ProtectedRoute> <SettingsPage /> </ProtectedRoute>}
        />

        {/* Default Redirect */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
