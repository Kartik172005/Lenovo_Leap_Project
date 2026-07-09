import React, { useEffect, useState } from "react";
import { Users, Building2, Package, CheckCircle2, Trash2 } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import DonationTable from "../components/DonationTable";

const COLORS = ["#16a34a", "#4ade80", "#86efac", "#f59e0b", "#f43f5e", "#3b82f6"];

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [donors, setDonors] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [donations, setDonations] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, donorsRes, ngosRes, donationsRes, completedRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/donors"),
        api.get("/admin/ngos"),
        api.get("/admin/donations"),
        api.get("/admin/donations/completed"),
      ]);
      setStats(statsRes.data);
      setDonors(donorsRes.data);
      setNgos(ngosRes.data);
      setDonations(donationsRes.data);
      setCompleted(completedRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    await api.delete(`/admin/users/${id}`);
    fetchAll();
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "donors", label: "Donors" },
    { key: "ngos", label: "NGOs" },
    { key: "donations", label: "All Donations" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Platform-wide overview and management</p>
      </div>

      {stats && (
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Donors" value={stats.totalDonors} icon={Users} color="primary" />
          <StatCard label="Total NGOs" value={stats.totalNGOs} icon={Building2} color="blue" />
          <StatCard label="Total Donations" value={stats.totalDonations} icon={Package} color="amber" />
          <StatCard label="Completed Donations" value={stats.completedDonations} icon={CheckCircle2} color="rose" />
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.key ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-primary-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card text-center text-gray-400">Loading dashboard...</div>
      ) : (
        <>
          {tab === "overview" && stats && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h3 className="mb-4 font-bold text-gray-800">Donations by Status</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.statusBreakdown.map((s) => ({ name: s._id, value: s.count }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {stats.statusBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="mb-4 font-bold text-gray-800">Donations by Category</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={stats.categoryBreakdown.map((c) => ({ name: c._id, count: c.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {tab === "donors" && (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Organization</th>
                    <th className="py-3 pr-4">Phone</th>
                    <th className="py-3 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((d) => (
                    <tr key={d._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-4 font-medium">{d.name}</td>
                      <td className="py-3 pr-4">{d.email}</td>
                      <td className="py-3 pr-4">{d.organizationName || "—"}</td>
                      <td className="py-3 pr-4">{d.phone || "—"}</td>
                      <td className="py-3 pr-4">
                        <button onClick={() => handleDeleteUser(d._id)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "ngos" && (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <th className="py-3 pr-4">NGO Name</th>
                    <th className="py-3 pr-4">Contact</th>
                    <th className="py-3 pr-4">Capacity/Day</th>
                    <th className="py-3 pr-4">Handled</th>
                    <th className="py-3 pr-4">Verified</th>
                    <th className="py-3 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {ngos.map((n) => (
                    <tr key={n._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 pr-4 font-medium">{n.ngoName}</td>
                      <td className="py-3 pr-4">{n.user?.email}</td>
                      <td className="py-3 pr-4">{n.capacityPerDay} kg</td>
                      <td className="py-3 pr-4">{n.totalDonationsHandled}</td>
                      <td className="py-3 pr-4">
                        <span className={`badge ${n.isVerified ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"}`}>
                          {n.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <button onClick={() => handleDeleteUser(n.user?._id)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "donations" && <DonationTable donations={donations} columns="ngo" />}
          {tab === "completed" && <DonationTable donations={completed} columns="ngo" />}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
