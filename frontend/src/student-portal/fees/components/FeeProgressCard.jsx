function FeeProgressCard({ dashboard }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Progress</h2>

      <div className="mb-3 flex justify-between">
        <span>Paid Amount</span>

        <span className="font-bold">
          ₹ {dashboard.paidAmount.toLocaleString()}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-600 h-4 rounded-full"
          style={{
            width: `${dashboard.progress}%`,
          }}
        />
      </div>

      <p className="mt-3 text-center font-bold text-green-600">
        {dashboard.progress}% Completed
      </p>
    </div>
  );
}

export default FeeProgressCard;
