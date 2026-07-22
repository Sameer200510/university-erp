import React, { useEffect, useState } from "react";

import AttendanceStatsCards from "../components/AttendanceStatsCards";
import AttendanceTable from "../components/AttendanceTable";

import { academicService } from "../services/academic.service";

function AttendancePage() {
  const [attendance, setAttendance] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const data = await academicService.getAttendance();

        setAttendance(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  if (loading) {
    return <div className="p-6">Loading Attendance...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance</h1>

      <AttendanceStatsCards attendance={attendance} />

      <AttendanceTable subjects={attendance.subjects} />
    </div>
  );
}

export default AttendancePage;
