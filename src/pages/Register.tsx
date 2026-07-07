import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole, MonitorPlay, ShieldCheck, User } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import "../styles/RegisterGlow.css";
import { apiUrl } from "../services/api";

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
      await axios.post(apiUrl("/api/auth/register"), {
        username: name,
        password,
        role,
      });

      Swal.fire({
        icon: "success",
        title: "Registrasi berhasil!",
        text: "Silakan login untuk melanjutkan.",
        timer: 1500,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Registrasi gagal, silakan coba lagi.";
      setError(message);
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => navigate("/");

  return (
    <main className="auth-page px-5 py-8 sm:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl">
          <div className="auth-brand-icon mb-8 inline-flex h-12 w-12 items-center justify-center rounded-lg text-white">
            <MonitorPlay aria-hidden="true" size={25} />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#1f6f64]">
            Display Hub
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-normal text-[#17202a] sm:text-5xl">
            Tambahkan akses pengguna untuk operasional display.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Buat akun untuk tim yang mengatur slot TV dan data customer di area layanan.
          </p>
        </div>

        <div className="auth-panel p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-normal text-[#17202a]">Create account</h2>
            <p className="mt-2 text-sm text-slate-500">Tambahkan user Display Hub baru.</p>
          </div>

          {error ? <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <form className="space-y-5" onSubmit={handleRegister}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
              <span className="auth-input-shell">
                <User className="auth-field-icon" size={18} aria-hidden="true" />
                <input
                  className="auth-field"
                  type="text"
                  autoComplete="name"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
              <span className="auth-input-shell">
                <ShieldCheck className="auth-field-icon" size={18} aria-hidden="true" />
                <select
                  className="auth-field"
                  value={role || ""}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <span className="auth-input-shell">
                <LockKeyhole className="auth-field-icon" size={18} aria-hidden="true" />
                <input
                  className="auth-field"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Buat password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </span>
            </label>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
              Create account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <button type="button" onClick={handleLogin} className="auth-link">
              Sign in
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
