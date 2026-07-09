import React, { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, ThumbsUp, Check, X, Flag } from "lucide-react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import DonationTable from "../components/DonationTable";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/donations/assigned");
      setDonations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoadingId(id);
    try {
      await api.put(`/donations/${id}/${action}`);
      await fetchDonations();
    } finally {
      setActionLoadingId(null);
    }
  };

  const stats = {
    available: donations.filter((d) => d.status === "Assigned").length,
    accepted: donations.filter((d) => d.status === "Accepted").length,
    completed: donations.filter((d) => d.status === "Completed").length,
    pending: donations.filter((d) => d.status === "Pending").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">NGO Dashboard</h1>
        <p className="text-sm text-gray-500">Donations matched to your organization by the AI agent</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available Donations" value={stats.available} icon={Package} color="primary" />
        <StatCard label="Accepted" value={stats.accepted} icon={ThumbsUp} color="blue" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="rose" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
      </div>

      <h2 className="mb-4 text-lg font-bold text-gray-800">Assigned Donations</h2>
      {loading ? (
        <div className="card text-center text-gray-400">Loading donations...</div>
      ) : (
        <DonationTable
          donations={donations}
          columns="ngo"
          actions={(d) => (
            <div className="flex items-center gap-2">
              {d.status === "Assigned" && (
                <>
                  <button
                    disabled={actionLoadingId === d._id}
                    onClick={() => handleAction(d._id, "accept")}
                    className="text-primary-600 hover:text-primary-800"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    disabled={actionLoadingId === d._id}
                    onClick={() => handleAction(d._id, "reject")}
                    className="text-rose-500 hover:text-rose-700"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </>
              )}
              {d.status === "Accepted" && (
                <button
                  disabled={actionLoadingId === d._id}
                  onClick={() => handleAction(d._id, "complete")}
                  className="text-blue-600 hover:text-blue-800"
                  title="Mark Completed"
                >
                  <Flag size={18} />
                </button>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default NGODashboard;
