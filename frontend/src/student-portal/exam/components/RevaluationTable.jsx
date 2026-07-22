function RevaluationTable({ applications }) {
  if (!applications?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-700">
          No Revaluation Applications
        </h3>

        <p className="text-gray-500 mt-2">
          You have not applied for any subject revaluation yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">Subject</th>
            <th className="p-4 text-left">Semester</th>
            <th className="p-4 text-left">Fee</th>
            <th className="p-4 text-left">Applied Date</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50 transition">
              <td className="p-4">
                <div className="font-semibold text-gray-800">
                  {item.subjectCode}
                </div>

                <div className="text-sm text-gray-500">{item.subjectName}</div>
              </td>

              <td className="p-4">Semester {item.semester}</td>

              <td className="p-4 font-medium">₹{item.fee}</td>

              <td className="p-4">
                {new Date(item.appliedAt).toLocaleDateString()}
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : item.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
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

export default RevaluationTable;
