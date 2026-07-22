import React from "react";

function ResultsTable({ results }) {
  if (!results?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        No Results Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3">Semester</th>
            <th className="p-3">SGPA</th>
            <th className="p-3">CGPA</th>
            <th className="p-3">Back Papers</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {results.map((result) => (
            <tr key={result.id} className="border-b">
              <td className="p-3">{result.semester}</td>
              <td className="p-3">{result.sgpa}</td>
              <td className="p-3">{result.cgpa}</td>
              <td className="p-3">{result.backPapers}</td>
              <td className="p-3">{result.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
