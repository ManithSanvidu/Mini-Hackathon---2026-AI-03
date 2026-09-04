import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Villager",
    officerCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post("/api/auth/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center bg-no-repeat bg-fixed px-4 py-12"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2069&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="w-full max-w-md relative z-10 mt-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-400">
            <ShieldAlert size={28} />
          </div>
          <span className="font-serif font-bold text-3xl text-white tracking-wide">
            FenceGuard LK
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/60 text-sm mb-6">Join FenceGuard LK today</p>

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm rounded-lg px-4 py-3 mb-5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Account created! Redirecting to login…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 bg-red-500/20 border border-red-400/40 text-red-300 text-sm rounded-lg px-4 py-3 mb-5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm text-white/70 mb-1">
                Full Name
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Kamal Perera"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm text-white/70 mb-1">
                Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm text-white/70 mb-1">
                Password
              </label>
              <input
                id="reg-password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="reg-role" className="block text-sm text-white/70 mb-1">
                I am a…
              </label>
              <select
                id="reg-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 transition cursor-pointer"
              >
                <option value="Villager" className="text-gray-900">Villager</option>
                <option value="Officer" className="text-gray-900">Wildlife Officer</option>
              </select>
            </div>

            {/* Officer code (conditional) */}
            {form.role === "Officer" && (
              <div>
                <label htmlFor="reg-officer-code" className="block text-sm text-white/70 mb-1">
                  Officer Registration Code
                </label>
                <input
                  id="reg-officer-code"
                  name="officerCode"
                  type="password"
                  required
                  value={form.officerCode}
                  onChange={handleChange}
                  placeholder="Enter the code provided by your supervisor"
                  className="w-full bg-white/10 border border-amber-400/40 text-white placeholder-white/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 transition"
                />
                <p className="text-amber-400/70 text-xs mt-1">
                  Required for Wildlife Officer accounts.
                </p>
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 active:scale-95 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
