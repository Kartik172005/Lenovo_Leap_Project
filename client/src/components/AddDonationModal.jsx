import React, { useState } from "react";
import { X, UploadCloud, Sparkles } from "lucide-react";
import api from "../api/axios";

const categories = ["Veg", "Non-Veg", "Bakery", "Packaged", "Cooked", "Other"];

const AddDonationModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    foodName: "",
    category: "Veg",
    quantity: "",
    unit: "kg",
    preparationTime: "",
    expiryTime: "",
    description: "",
    pickupAddress: "",
    latitude: "",
    longitude: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      const { data } = await api.post("/donations", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAiResult(data);
      onCreated && onCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl animate-slide-up">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Add Food Donation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X />
          </button>
        </div>

        {aiResult ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary-50 p-5">
              <div className="mb-2 flex items-center gap-2 font-semibold text-primary-700">
                <Sparkles size={18} /> AI Agent Recommendation
              </div>
              <p className="text-sm text-gray-600">
                Priority: <span className="font-semibold">{aiResult.aiPriority}</span>
              </p>
              <p className="text-sm text-gray-600">
                Recommended NGO:{" "}
                <span className="font-semibold">{aiResult.assignedNGO?.ngoName || "Not assigned yet"}</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">Reason: {aiResult.aiReason}</p>
            </div>
            <button onClick={onClose} className="btn-primary w-full">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</div>}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Food Name</label>
                <input name="foodName" required className="input-field" value={form.foodName} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Category</label>
                <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Quantity</label>
                <input type="number" min="0" step="0.1" name="quantity" required className="input-field" value={form.quantity} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Unit</label>
                <select name="unit" className="input-field" value={form.unit} onChange={handleChange}>
                  <option value="kg">kg</option>
                  <option value="meals">meals</option>
                  <option value="items">items</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Preparation Time</label>
                <input type="datetime-local" name="preparationTime" className="input-field" value={form.preparationTime} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Expiry Time</label>
                <input type="datetime-local" name="expiryTime" required className="input-field" value={form.expiryTime} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-600">Pickup Address</label>
                <input name="pickupAddress" required className="input-field" value={form.pickupAddress} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Latitude</label>
                <input type="number" step="any" name="latitude" className="input-field" value={form.latitude} onChange={handleChange} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Longitude</label>
                <input type="number" step="any" name="longitude" className="input-field" value={form.longitude} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-600">Description</label>
                <textarea name="description" rows={3} className="input-field" value={form.description} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm text-gray-500 hover:border-primary-300">
                  <UploadCloud size={18} />
                  {image ? image.name : "Upload food image"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Analyzing with AI Agent..." : "Submit Donation"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddDonationModal;
