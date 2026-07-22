import { feesService } from "../services/fees.service";

function ReceiptsTable({ receipts }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Receipt No</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Transaction</th>
            <th className="p-4 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {receipts.map((receipt) => (
            <tr key={receipt.id} className="border-t">
              <td className="p-4">{receipt.receiptNo}</td>

              <td className="p-4">
                ₹ {receipt.payment.amount.toLocaleString()}
              </td>

              <td className="p-4">{receipt.payment.transactionId}</td>

              <td className="p-4">
                <button
                  onClick={async () => {
                    try {
                      const response = await feesService.downloadReceipt(
                        receipt.id,
                      );

                      window.open(
                        `${import.meta.env.VITE_API_BASE_URL}${response.pdfUrl}`,
                        "_blank",
                      );
                    } catch (error) {
                      console.error(error);

                      alert("Failed to download receipt");
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReceiptsTable;
