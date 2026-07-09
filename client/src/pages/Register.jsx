import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  admin: "/admin-dashboard",
  donor: "/donor-dashboard",
  ngo: "/ngo-dashboard",
};

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    phone: "",
    address: "",
    organizationName: "",
    ngoName: "",
    capacityPerDay: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await register(form);
      navigate(dashboardPath[data.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-primary-50 to-white px-6 py-12">
      <div className="w-full max-w-lg animate-slide-up rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <Leaf size={24} />
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900">Create Your Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join as a Donor, NGO, or Admin</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">I am registering as</label>
            <div className="grid grid-cols-3 gap-2">
              {["donor", "ngo", "admin"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                    form.role === r
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-500 hover:border-primary-200"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Full Name</label>
              <input name="name" required className="input-field" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
              <input type="email" name="email" required className="input-field" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Password</label>
              <input type="password" name="password" required minLength={6} className="input-field" value={form.password} onChange={handleChange} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">Phone</label>
              <input name="phone" className="input-field" value={form.phone} onChange={handleChange} />
            </div>

            {form.role === "donor" && (
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-600">Restaurant / Hotel Name</label>
                <input name="organizationName" className="input-field" value={form.organizationName} onChange={handleChange} />
              </div>
            )}

            {form.role === "ngo" && (
              <>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-600">NGO Name</label>
                  <input name="ngoName" className="input-field" value={form.ngoName} onChange={handleChange} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Daily Capacity (kg)</label>
                  <input type="number" name="capacityPerDay" className="input-field" value={form.capacityPerDay} onChange={handleChange} />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-600">Address</label>
              <input name="address" className="input-field" value={form.address} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <UserPlus size={18} /> {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
