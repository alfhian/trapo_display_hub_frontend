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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire("Oops!", "Please fill in all fields.", "warning");
      return;
    }

    // Dummy login check (sementara)
    if (username === "admin" && password === "admin") {
      const payload = {
        sub: "1",
        userid: "admin",
        role: "admin",
        name: "Administrator",
        is_active: true,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // berlaku 1 hari
      };

      // Simulasi JWT encode
      const fakeToken =
        "header." + btoa(JSON.stringify(payload)) + ".signature";
      localStorage.setItem("token", fakeToken);

      Swal.fire({
        icon: "success",
        title: "Welcome, Admin!",
        text: "Login successful.",
        timer: 1000,
        showConfirmButton: false,
        willClose: () => navigate("/dashboard"),
      });
    } else {
      Swal.fire("Access Denied", "Invalid username or password.", "error");
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input type="submit" value="Sign in" />
          <div className="group">
            <a href="#">Forgot Password</a>
            <Link to="/register">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default Login;
