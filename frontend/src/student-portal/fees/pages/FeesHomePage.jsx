import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { feesService } from "../services/fees.service";

import FeeSummaryCards from "../components/FeeSummaryCards";
import CurrentDueCard from "../components/CurrentDueCard";
import FeeProgressCard from "../components/FeeProgressCard";

function FeesHomePage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const [installments, setInstallments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const dashboardData = await feesService.getDashboard();

      const installmentData = await feesService.getInstallments();

      setDashboard(dashboardData);

      setInstallments(installmentData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!dashboard) {
    return <div className="p-6">Failed to load fee data</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Fees Management</h1>

      <p className="text-gray-500 mb-8">
        View fees, installments, receipts and payment history.
      </p>

      {/* Summary Cards */}
      <FeeSummaryCards data={dashboard} />

      {/* Current Due + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <CurrentDueCard currentDue={dashboard.currentDue} />

        <FeeProgressCard dashboard={dashboard} />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div
          onClick={() => navigate("/student/fees/installments")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">Installments</h2>

          <p className="text-gray-500">View semester wise fee installments</p>
        </div>

        <div
          onClick={() => navigate("/student/fees/payments")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">Payment History</h2>

          <p className="text-gray-500">View all successful payments</p>
        </div>

        <div
          onClick={() => navigate("/student/fees/receipts")}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition-all"
        >
          <h2 className="text-xl font-semibold mb-2">Receipts</h2>

          <p className="text-gray-500">Download fee receipts</p>
        </div>
      </div>
    </div>
  );
}

export default FeesHomePage;
