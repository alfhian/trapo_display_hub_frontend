import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "../styles/RegisterGlow.css";
import logoTrapo from "../assets/LOGO_TRAPO.png";

const Register = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !role || !password) {
      Swal.fire("Oops!", "Silakan isi semua field!", "warning");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        userid: name,
        password,
        role,
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: name,
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Registrasi gagal");
      }

      Swal.fire({
        icon: "success",
        title: "Registrasi berhasil!",
        text: "Silakan login untuk melanjutkan.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Registrasi gagal, silakan coba lagi.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => navigate("/");

  return (
    <div className="register-page min-h-screen flex items-center justify-center">
      <div className="box">
        <div className="form w-[70%]">
          <img src={logoTrapo} alt="Trapo Logo" />

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <select
              value={role || ""}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Pilih Role
              </option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>

            <div className="bottom-text text-center">
              Sudah punya akun?{" "}
              <span onClick={handleLogin}>Sign in</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
