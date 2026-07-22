import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { academicService } from "../services/academic.service";

function AttendanceDetailsPage() {
  const { subjectId } = useParams();

  const [attendance, setAttendance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;

  useEffect(() => {
    async function loadAttendance() {
      try {
        const data = await academicService.getAttendanceDetails(subjectId);

        setAttendance(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAttendance();
  }, [subjectId]);

  if (!attendance) {
    return <div className="p-6">Loading...</div>;
  }

  const startIndex = (currentPage - 1) * recordsPerPage;

  const currentRecords = attendance.records.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  const totalPages = Math.ceil(attendance.records.length / recordsPerPage);

  return (
    <div className="p-6">
      {/* Subject Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{attendance.subject.name}</h1>

        <p className="text-gray-500 mt-1">
          Faculty: {attendance.subject.facultyName}
        </p>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Total Classes</h3>

          <p className="text-3xl font-bold">{attendance.summary.total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Present</h3>

          <p className="text-3xl font-bold text-green-600">
            {attendance.summary.present}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Absent</h3>

          <p className="text-3xl font-bold text-red-600">
            {attendance.summary.absent}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Leave</h3>

          <p className="text-3xl font-bold text-yellow-500">
            {attendance.summary.leave}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Attendance %</h3>

          <p className="text-3xl font-bold text-blue-600">
            {attendance.summary.percentage}%
          </p>
        </div>
      </div>

      {/* Attendance Records Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((record) => (
              <tr key={record.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === "PRESENT"
                        ? "bg-green-100 text-green-700"
                        : record.status === "ABSENT"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} -{" "}
            {Math.min(startIndex + recordsPerPage, attendance.records.length)}{" "}
            of {attendance.records.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              ← Previous
            </button>

            <span className="px-4 font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceDetailsPage;
