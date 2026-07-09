import React, { useEffect, useState } from "react";
import { User, Save } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "", phone: "", address: "", organizationName: "", password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          organizationName: data.organizationName || "",
          password: "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      const { data } = await api.put("/auth/profile", payload);
      setUser({ ...user, name: data.name });
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-2xl px-6 py-16 text-center text-gray-400">Loading profile...</div>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <User size={26} />
        </span>
        <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500">{user?.email} · <span className="capitalize">{user?.role}</span></p>
      </div>

      {message && <div className="mb-4 rounded-lg bg-primary-50 px-4 py-2 text-sm text-primary-700">{message}</div>}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">Full Name</label>
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">Phone</label>
          <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">Address</label>
          <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        {user?.role === "donor" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Organization Name</label>
            <input className="input-field" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">New Password (leave blank to keep current)</label>
          <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
