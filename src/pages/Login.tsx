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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire("Oops!", "Please fill in all fields.", "warning");
      return;
    }

    setIsLoading(true);

    
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/auth/login', {
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
        } else {
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
      } else {
        // Tangani pesan error dari API
        Swal.fire("Access Denied", data.message || "Invalid username or password.", "error");
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire("Error", "An error occurred during login. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
      
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-[#252432]">
      <div className="box">
        <div className="login">
          <form onSubmit={handleLogin} className="loginBx">
            <img
              src={logoTrapo}
              alt="Trapo Logo"
              className="h-10 mb-2 transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_#45f3ff]"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <input 
              type="submit" 
              value={isLoading ? "Signing in..." : "Sign in"} 
              disabled={isLoading}
            />
            <div className="copyright text-center mt-4 text-sm text-gray-400">
            <a href="#">© Trapo Indonesia 2025</a>
              <Link to="/register"></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;