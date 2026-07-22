function BackPapersTable({ papers }) {
  if (!papers?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        No Back Paper Applications Found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="p-3 text-left">Subject Code</th>
            <th className="p-3 text-left">Subject Name</th>
            <th className="p-3 text-left">Semester</th>
            <th className="p-3 text-left">Fee</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Payment</th>
          </tr>
        </thead>

        <tbody>
          {papers.map((paper) => (
            <tr key={paper.id} className="border-b">
              <td className="p-3">{paper.subjectCode}</td>
              <td className="p-3">{paper.subjectName}</td>
              <td className="p-3">{paper.semester}</td>
              <td className="p-3">₹{paper.fee}</td>

              <td className="p-3">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  {paper.status}
                </span>
              </td>

              <td className="p-3">
                <span
                  className={
                    paper.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      : "bg-red-100 text-red-700 px-3 py-1 rounded-full"
                  }
                >
                  {paper.paymentStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BackPapersTable;
