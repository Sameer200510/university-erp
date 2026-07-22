import React, { useEffect, useState } from "react";

import { feesService } from "../services/fees.service";

import ReceiptsTable from "../components/ReceiptsTable";

function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipts();
  }, []);

  async function loadReceipts() {
    try {
      const data = await feesService.getReceipts();

      setReceipts(data);
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
      <h1 className="text-3xl font-bold mb-6">Fee Receipts</h1>

      <ReceiptsTable receipts={receipts} />
    </div>
  );
}

export default ReceiptsPage;
