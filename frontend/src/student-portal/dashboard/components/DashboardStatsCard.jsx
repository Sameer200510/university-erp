import React from "react";

const DashboardStatsCard = ({ title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    amber: "text-amber-600",
    purple: "text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <h4 className="text-sm text-gray-500">{title}</h4>

      <p
        className={`text-2xl font-bold mt-2 ${
          colorClasses[color] || "text-blue-600"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default DashboardStatsCard;
