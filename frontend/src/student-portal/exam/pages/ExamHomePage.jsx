import { useEffect, useState } from "react";
import examService from "../services/exam.service";

import ExamStatsCards from "../components/ExamStatsCards";
import QuickExamLinks from "../components/QuickExamLinks";

function ExamHomePage() {
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await examService.getDashboard();

      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading Exam Dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Examination Dashboard</h1>

        <p className="text-gray-500 mt-2">
          Manage examination activities, results, admit cards and marksheets.
        </p>
      </div>

      <ExamStatsCards stats={stats} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">Examination Services</h2>

        <QuickExamLinks />
      </div>
    </div>
  );
}

export default ExamHomePage;
