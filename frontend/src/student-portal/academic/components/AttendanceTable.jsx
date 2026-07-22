import React from "react";
import { useNavigate } from "react-router-dom";

function AttendanceTable({ subjects }) {
  const navigate = useNavigate();

  const getColor = (percentage) => {
    if (percentage >= 75) return "bg-green-100 text-green-700";

    if (percentage >= 60) return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">Subject</th>
            <th className="text-left p-4">Faculty</th>
            <th className="text-left p-4">Attendance</th>
            <th className="text-left p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subjectId} className="border-t">
              <td className="p-4">{subject.subjectName}</td>

              <td className="p-4">{subject.facultyName}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getColor(
                    subject.percentage,
                  )}`}
                >
                  {subject.percentage}%
                </span>
              </td>

              <td className="p-4">
                <button
                  onClick={() =>
                    navigate(
                      `/student/academic/attendance/${subject.subjectId}`,
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;
