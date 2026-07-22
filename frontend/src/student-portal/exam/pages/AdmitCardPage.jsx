import { useEffect, useState } from "react";

import examService from "../services/exam.service";

import DebarredSubjectsTable from "../components/DebarredSubjectsTable";

function AdmitCardPage() {
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await examService.getAdmitCardEligibility();

      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading Admit Card...</div>;
  }

  const debarredSubjects = data.subjects.filter((s) => s.status === "DEBARRED");

  const eligibleSubjects = data.subjects.filter((s) => s.status === "ELIGIBLE");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Admit Card Eligibility</h1>

      <p className="text-gray-500 mb-8">
        Subject-wise attendance verification.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Minimum Attendance</p>

          <h2 className="text-4xl font-bold mt-2">{data.minimumAttendance}%</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Eligible Subjects</p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {eligibleSubjects.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Debarred Subjects</p>

          <h2 className="text-4xl font-bold text-red-600 mt-2">
            {debarredSubjects.length}
          </h2>
        </div>
      </div>

      {debarredSubjects.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Debarred Subjects Found
          </h3>

          <p className="text-red-600">
            You are currently debarred in some subjects due to low attendance.
            Contact administration if relaxation approval is applicable.
          </p>
        </div>
      )}

      <DebarredSubjectsTable subjects={data.subjects} />
      <div className="mt-5">
        <button
          onClick={async () => {
            try {
              const admitCard = await examService.generateAdmitCard();

              window.open(`http://localhost:5050${admitCard.pdfUrl}`, "_blank");
            } catch (error) {
              console.error(error);
            }
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Generate Admit Card
        </button>
      </div>
    </div>
  );
}

export default AdmitCardPage;
