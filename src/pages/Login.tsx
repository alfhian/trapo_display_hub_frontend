import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Oops!", "Please enter both email and password.", "warning");
      return;
    }

    try {
      // 🔐 Simulasi response API JWT (ganti ini nanti ke fetch real API)
      const fakeJWT =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcmlkIjoiMTIzIiwicm9sZSI6ImFkbWluIiwibmFtZSI6IkR6dWxmaWthciIsImlzX2FjdGl2ZSI6dHJ1ZSwiZXhwIjoyNTM0MjE2MDAwfQ." +
        "dummySignature123";

      localStorage.setItem("token", fakeJWT);

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "Login successful.",
        timer: 1000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      Swal.fire("Error", "Invalid credentials.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#7883FF]"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#7883FF]"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-[#7883FF] hover:bg-[#6a73e6] text-white rounded-full font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#7883FF] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
