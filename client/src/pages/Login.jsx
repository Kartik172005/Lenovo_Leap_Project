import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  admin: "/admin-dashboard",
  donor: "/donor-dashboard",
  ngo: "/ngo-dashboard",
};

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(form.email, form.password);
      navigate(dashboardPath[data.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary-50 to-white px-6 py-12">
      <div className="w-full max-w-md animate-slide-up rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Leaf size={24} />
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-500">Login to continue to AgriSave AI</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <LogIn size={18} /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
