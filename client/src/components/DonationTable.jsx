import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const statusStyles = {
  Pending: "bg-gray-100 text-gray-700",
  Assigned: "bg-blue-100 text-blue-700",
  Accepted: "bg-primary-100 text-primary-700",
  Rejected: "bg-rose-100 text-rose-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Expired: "bg-orange-100 text-orange-700",
};

const priorityStyles = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-primary-100 text-primary-700",
};

const DonationTable = ({ donations = [], columns = "donor", actions }) => {
  if (!donations.length) {
    return (
      <div className="card text-center text-gray-400">
        No donations to show yet.
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="py-3 pr-4">Food Name</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Quantity</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Priority</th>
            <th className="py-3 pr-4">{columns === "donor" ? "Assigned NGO" : "Donor"}</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4"></th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
              <td className="py-3 pr-4 font-medium text-gray-800">{d.foodName}</td>
              <td className="py-3 pr-4">{d.category}</td>
              <td className="py-3 pr-4">{d.quantity} {d.unit}</td>
              <td className="py-3 pr-4">
                <span className={`badge ${statusStyles[d.status] || "bg-gray-100 text-gray-700"}`}>
                  {d.status}
                </span>
              </td>
              <td className="py-3 pr-4">
                {d.aiPriority && (
                  <span className={`badge ${priorityStyles[d.aiPriority] || "bg-gray-100 text-gray-700"}`}>
                    {d.aiPriority}
                  </span>
                )}
              </td>
              <td className="py-3 pr-4">
                {columns === "donor"
                  ? d.assignedNGO?.ngoName || "—"
                  : d.createdBy?.organizationName || d.createdBy?.name || "—"}
              </td>
              <td className="py-3 pr-4 text-gray-500">
                {new Date(d.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <Link to={`/donation/${d._id}`} className="text-primary-600 hover:text-primary-800">
                    <Eye size={18} />
                  </Link>
                  {actions && actions(d)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;
