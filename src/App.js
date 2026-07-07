import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import DisplayHubPage from "./pages/DisplayHubPage";
import DisplayScreenPage from './pages/DisplayScreenPage';
import SettingsPage from "./pages/SettingsPage";
import './styles/Navbar.css';
function App() {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), "/* ProtectedRoute */", _jsx(Route, { path: "/dashboard", element: _jsxs(ProtectedRoute, { children: [" ", _jsx(DashboardPage, {}), " "] }) }), _jsx(Route, { path: "/display-hub", element: _jsx(DisplayHubPage, {}) }), _jsx(Route, { path: "/display/:id", element: _jsx(DisplayScreenPage, {}) }), _jsx(Route, { path: "/settings", element: _jsxs(ProtectedRoute, { children: [" ", _jsx(SettingsPage, {}), " "] }) }), _jsx(Route, { path: "*", element: _jsx(Login, {}) })] }) }));
}
export default App;
