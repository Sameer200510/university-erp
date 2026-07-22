function InstallmentsTable({ installments }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Semester</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Due Date</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {installments.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">Semester {item.semester}</td>

              <td className="p-4">₹ {item.amount.toLocaleString()}</td>

              <td className="p-4">
                {new Date(item.dueDate).toLocaleDateString()}
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstallmentsTable;
