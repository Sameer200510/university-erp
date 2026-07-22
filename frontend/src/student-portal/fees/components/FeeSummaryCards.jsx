function FeeSummaryCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-gray-500">Total Fee</h3>

        <p className="text-2xl font-bold text-blue-600">
          ₹ {data.totalFee.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-gray-500">Scholarship</h3>

        <p className="text-2xl font-bold text-green-600">
          ₹ {data.scholarship.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-gray-500">Net Fee</h3>

        <p className="text-2xl font-bold text-purple-600">
          ₹ {data.netFee.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-gray-500">Paid</h3>

        <p className="text-2xl font-bold text-green-700">
          ₹ {data.paidAmount.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-gray-500">Pending</h3>

        <p className="text-2xl font-bold text-red-600">
          ₹ {data.pendingAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default FeeSummaryCards;
