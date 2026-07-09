import React, { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, ThumbsUp, Plus } from "lucide-react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import DonationTable from "../components/DonationTable";
import AddDonationModal from "../components/AddDonationModal";

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/donations/mine");
      setDonations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "Pending" || d.status === "Assigned").length,
    accepted: donations.filter((d) => d.status === "Accepted").length,
    completed: donations.filter((d) => d.status === "Completed").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Donor Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your surplus food donations</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Add Donation
        </button>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Donations" value={stats.total} icon={Package} color="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="amber" />
        <StatCard label="Accepted" value={stats.accepted} icon={ThumbsUp} color="blue" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="rose" />
      </div>

      <h2 className="mb-4 text-lg font-bold text-gray-800">My Donations</h2>
      {loading ? (
        <div className="card text-center text-gray-400">Loading donations...</div>
      ) : (
        <DonationTable donations={donations} columns="donor" />
      )}

      {showModal && (
        <AddDonationModal
          onClose={() => setShowModal(false)}
          onCreated={() => fetchDonations()}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
