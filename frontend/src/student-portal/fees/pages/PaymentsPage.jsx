import React, { useEffect, useState } from "react";

import { feesService } from "../services/fees.service";

import PaymentsTable from "../components/PaymentsTable";

function PaymentsPage() {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const data = await feesService.getPayments();

      setPayments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>

      <PaymentsTable payments={payments} />
    </div>
  );
}

export default PaymentsPage;
