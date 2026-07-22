import React from "react";

function AttendanceStatsCards({ attendance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-sm text-gray-500">Overall Attendance</h3>

        <p className="text-3xl font-bold text-blue-600">
          {attendance.overallAttendance}%
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-sm text-gray-500">Present</h3>

        <p className="text-3xl font-bold text-green-600">
          {attendance.present}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-sm text-gray-500">Absent</h3>

        <p className="text-3xl font-bold text-red-600">{attendance.absent}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-sm text-gray-500">Leave</h3>

        <p className="text-3xl font-bold text-yellow-500">{attendance.leave}</p>
      </div>
    </div>
  );
}

export default AttendanceStatsCards;
