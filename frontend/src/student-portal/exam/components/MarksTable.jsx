import React from "react";

function MarksTable({ marks }) {
  if (!marks?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        No Marks Found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Semester</th>
            <th className="p-3 text-left">Subject ID</th>
            <th className="p-3 text-left">Exam Type</th>
            <th className="p-3 text-left">Marks Type</th>
            <th className="p-3 text-left">Marks</th>
          </tr>
        </thead>

        <tbody>
          {marks.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.semester}</td>
              <td className="p-3">{item.subjectId}</td>
              <td className="p-3">{item.examType}</td>
              <td className="p-3">{item.marksType}</td>
              <td className="p-3 font-semibold">{item.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarksTable;
