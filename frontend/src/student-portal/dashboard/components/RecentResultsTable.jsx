import React from "react";

const RecentResultsTable = ({ results }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Results</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Semester</th>
              <th className="text-left py-3">SGPA</th>
              <th className="text-left py-3">CGPA</th>
              <th className="text-left py-3">Back Papers</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{result.semester}</td>

                <td className="py-3">{result.sgpa}</td>

                <td className="py-3">{result.cgpa}</td>

                <td className="py-3">{result.backPapers}</td>

                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      result.status === "PASS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {result.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentResultsTable;
