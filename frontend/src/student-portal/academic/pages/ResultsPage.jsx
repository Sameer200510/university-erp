import React, { useEffect, useState } from "react";
import { academicService } from "../services/academic.service";

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await academicService.getResults();

        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return <div className="p-6">Loading Results...</div>;
  }

  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  const totalBackPapers = results.reduce(
    (sum, result) => sum + result.backPapers,
    0,
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Academic Results</h1>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Current CGPA</h3>

          <p className="text-3xl font-bold text-blue-600">
            {latestResult?.cgpa ?? "-"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Latest SGPA</h3>

          <p className="text-3xl font-bold text-green-600">
            {latestResult?.sgpa ?? "-"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Semesters</h3>

          <p className="text-3xl font-bold">{results.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Back Papers</h3>

          <p className="text-3xl font-bold text-red-600">{totalBackPapers}</p>
        </div>
      </div>

      {/* Results Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Semester</th>

              <th className="p-4 text-left">SGPA</th>

              <th className="p-4 text-left">CGPA</th>

              <th className="p-4 text-left">Back Papers</th>

              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-t">
                <td className="p-4">Semester {result.semester}</td>

                <td className="p-4">{result.sgpa}</td>

                <td className="p-4">{result.cgpa}</td>

                <td className="p-4">{result.backPapers}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.status === "PASS"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
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
}

export default ResultsPage;
