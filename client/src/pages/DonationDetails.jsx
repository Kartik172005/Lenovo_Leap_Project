import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Sparkles, Package } from "lucide-react";
import api from "../api/axios";

const statusStyles = {
  Pending: "bg-gray-100 text-gray-700",
  Assigned: "bg-blue-100 text-blue-700",
  Accepted: "bg-primary-100 text-primary-700",
  Rejected: "bg-rose-100 text-rose-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Expired: "bg-orange-100 text-orange-700",
};

const DonationDetails = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data } = await api.get(`/donations/${id}`);
        setDonation(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load donation");
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, [id]);

  if (loading) return <div className="mx-auto max-w-4xl px-6 py-16 text-center text-gray-400">Loading...</div>;
  if (error) return <div className="mx-auto max-w-4xl px-6 py-16 text-center text-rose-500">{error}</div>;
  if (!donation) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="card">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{donation.foodName}</h1>
            <p className="text-sm text-gray-500">{donation.category} · {donation.quantity} {donation.unit}</p>
          </div>
          <span className={`badge ${statusStyles[donation.status]}`}>{donation.status}</span>
        </div>

        {donation.imageUrl && (
          <img src={donation.imageUrl} alt={donation.foodName} className="mb-6 h-64 w-full rounded-2xl object-cover" />
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <MapPin className="mt-0.5 text-primary-600" size={18} />
            <div>
              <p className="text-xs text-gray-400">Pickup Address</p>
              <p className="text-sm font-medium text-gray-700">{donation.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <Clock className="mt-0.5 text-primary-600" size={18} />
            <div>
              <p className="text-xs text-gray-400">Expiry Time</p>
              <p className="text-sm font-medium text-gray-700">{new Date(donation.expiryTime).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <Package className="mt-0.5 text-primary-600" size={18} />
            <div>
              <p className="text-xs text-gray-400">Donor</p>
              <p className="text-sm font-medium text-gray-700">
                {donation.createdBy?.organizationName || donation.createdBy?.name}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <Sparkles className="mt-0.5 text-primary-600" size={18} />
            <div>
              <p className="text-xs text-gray-400">AI Priority</p>
              <p className="text-sm font-medium text-gray-700">{donation.aiPriority || "—"}</p>
            </div>
          </div>
        </div>

        {donation.description && (
          <div className="mb-6">
            <h3 className="mb-1 font-semibold text-gray-800">Description</h3>
            <p className="text-sm text-gray-600">{donation.description}</p>
          </div>
        )}

        <div className="rounded-2xl bg-primary-50 p-5">
          <div className="mb-2 flex items-center gap-2 font-semibold text-primary-700">
            <Sparkles size={18} /> AI Agent Recommendation
          </div>
          <p className="text-sm text-gray-600">
            Recommended NGO: <span className="font-semibold">{donation.assignedNGO?.ngoName || "Not yet assigned"}</span>
          </p>
          <p className="mt-1 text-sm text-gray-600">Reason: {donation.aiReason || "Pending AI analysis."}</p>
        </div>
      </div>
    </div>
  );
};

export default DonationDetails;
