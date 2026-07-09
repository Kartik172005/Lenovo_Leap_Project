import React from "react";

const colorMap = {
  primary: "bg-primary-50 text-primary-700",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  rose: "bg-rose-50 text-rose-700",
};

const StatCard = ({ label, value, icon: Icon, color = "primary" }) => {
  return (
    <div className="card flex items-center justify-between animate-slide-up">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-3xl font-extrabold text-gray-800">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[color]}`}>
        {Icon && <Icon size={22} />}
      </div>
    </div>
  );
};

export default StatCard;
