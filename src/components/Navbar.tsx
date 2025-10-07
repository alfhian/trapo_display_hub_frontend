// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/jwtHelper";
import { LogOut } from "lucide-react";

type NavbarProps = {
  title?: string;
};

const Navbar = ({ title = "Dashboard" }: NavbarProps) => {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center bg-[#f5f5f5] px-6 sm:px-10 md:px-12 py-6 rounded-xl shadow-sm">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
        {title}
      </h1>

      {/* Profile Section */}
      <div className="flex items-center gap-3">
        {/* User Badge */}
        <div className="flex items-center gap-3 px-5 py-2 bg-white text-gray-700 rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
          <span className="font-medium">
            {user?.name || "Guest"}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-1.5 bg-[#f68b8b] hover:bg-[#f57b7b] rounded-full text-white transition-all duration-300"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
