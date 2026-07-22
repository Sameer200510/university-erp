import React, { useEffect, useState } from "react";
import DashboardStatsCard from "../components/DashboardStatsCard";
import StudentProfileCard from "../components/StudentProfileCard";
import { dashboardService } from "../services/dashboard.service";
import RecentResultsTable from "../components/RecentResultsTable";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import StudentIdTemplate from "../components/StudentIdTemplate";

const DashboardPage = () => {
  const idCardRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [profileData, attendanceData, subjectsData, resultsData] =
        await Promise.all([
          dashboardService.getProfile(),
          dashboardService.getAttendance(),
          dashboardService.getSubjects(),
          dashboardService.getResults(),
        ]);

      setProfile(profileData);
      setAttendance(attendanceData);
      setSubjects(subjectsData);
      setResults(resultsData);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  async function downloadStudentId() {
    try {
      console.log("DOWNLOAD STARTED");

      if (!profile) return;

      if (!idCardRef.current) {
        console.log("NO CARD FOUND");
        return;
      }

      const card = idCardRef.current;

      const canvas = await html2canvas(card, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imageData, "PNG", 10, 10, 250, 145);

      pdf.save("student-id-card.pdf");

      console.log("PDF GENERATED");
    } catch (error) {
      console.error(error);
    }
  };

  const latestAttendance =
    attendance.length > 0 ? attendance[attendance.length - 1].percentage : 0;

  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 text-white shadow-md">
        <h2 className="text-3xl font-bold">
          Welcome Back, {profile?.firstName || "Student"} 👋
        </h2>

        <p className="mt-2 text-blue-100">University ERP Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatsCard
          title="Attendance"
          value={`${latestAttendance}%`}
          color="green"
        />

        <DashboardStatsCard
          title="CGPA"
          value={latestResult?.cgpa || "N/A"}
          color="blue"
        />

        <DashboardStatsCard
          title="Subjects"
          value={subjects.length}
          color="purple"
        />

        <DashboardStatsCard
          title="Semester"
          value={latestResult?.semester || "N/A"}
          color="amber"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StudentProfileCard
          profile={profile}
          onDownloadId={downloadStudentId}
        />

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Announcements</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Mid Semester Examination</h4>

              <p className="text-sm text-gray-500">
                Examination schedule will be released next week.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">Placement Drive</h4>

              <p className="text-sm text-gray-500">
                TCS and Infosys campus drive registration open.
              </p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-medium">Fee Submission</h4>

              <p className="text-sm text-gray-500">
                Last date for fee submission is 15th June.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Access</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Academic
          </button>

          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Fees
          </button>

          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Documents
          </button>

          <button className="p-4 rounded-lg border hover:bg-gray-50 transition">
            Profile
          </button>
        </div>
      </div>

      {profile && (
        <div
          ref={idCardRef}
          style={{
            position: "fixed",
            left: "-10000px",
            top: "0",
          }}
        >
          <StudentIdTemplate profile={profile} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
