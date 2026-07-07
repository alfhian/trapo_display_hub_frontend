import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, LockKeyhole, PackageCheck, User } from "lucide-react";
import Swal from "sweetalert2";
import "../styles/LoginGlow.css";
import { apiUrl } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage("");
    setSuccessMessage("");

    if (!username || !password) {
      setServerMessage("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        setSuccessMessage(`Selamat datang, ${data.user?.name || username}.`);

        Swal.fire({
          icon: "success",
          title: `Welcome, ${data.user?.name || username}!`,
          text: "Login successful.",
          timer: 1000,
          showConfirmButton: false,
          willClose: () => navigate("/dashboard"),
        });
      } else {
        setServerMessage(data.message || "Login gagal. Periksa kembali akun Anda.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerMessage("Login gagal. Periksa koneksi atau coba lagi beberapa saat.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page px-5 py-8 sm:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
        <div className="max-w-2xl">
          <div className="auth-brand-icon mb-8 inline-flex h-12 w-12 items-center justify-center rounded-lg text-white">
            <PackageCheck aria-hidden="true" size={25} />
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#1f6f64]">
            TRAPO Display Hub
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-[#17202a] sm:text-5xl">
            Pantau dan atur display layanan secara real-time.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Masuk untuk memantau status TV, memperbarui informasi customer, dan menjaga tampilan layanan tetap sinkron di seluruh area operasional.
          </p>
          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {["Dashboard", "Display Hub", "Live TV"].map((item) => (
              <div key={item} className="auth-chip px-4 py-3 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="auth-panel p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-[#17202a]">Masuk</h2>
            <p className="mt-2 text-sm text-slate-500">Gunakan akun admin Display Hub Anda.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <span className="auth-input-shell">
                <User className="auth-field-icon" size={18} aria-hidden="true" />
                <input
                  className="auth-field"
                  type="text"
                  autoComplete="username"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <span className="auth-input-shell">
                <LockKeyhole className="auth-field-icon" size={18} aria-hidden="true" />
                <input
                  className="auth-field pr-12"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="auth-password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </span>
            </label>

            {serverMessage ? <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverMessage}</div> : null}
            {successMessage ? <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}

            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : null}
              Masuk ke Display Hub
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
            <span>Trapo Indonesia</span>
            <Link to="/register" className="auth-link">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
