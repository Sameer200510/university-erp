function DebarredSubjectsTable({ subjects }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Subject</th>
            <th className="p-4 text-left">Attendance %</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subjectId} className="border-t">
              <td className="p-4">{subject.subjectName}</td>

              <td className="p-4">{subject.percentage}%</td>

              <td className="p-4">
                {subject.status === "ELIGIBLE" ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Eligible
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                    Debarred
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DebarredSubjectsTable;
