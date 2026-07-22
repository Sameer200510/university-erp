function PaymentsTable({ payments }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Transaction ID</th>
            <th className="p-4 text-left">Mode</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t">
              <td className="p-4">{payment.transactionId}</td>

              <td className="p-4">{payment.paymentMode}</td>

              <td className="p-4">₹ {payment.amount.toLocaleString()}</td>

              <td className="p-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentsTable;
