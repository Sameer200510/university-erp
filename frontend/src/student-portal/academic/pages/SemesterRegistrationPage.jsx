import React, { useEffect, useState } from "react";
import { academicService } from "../services/academic.service";

function SemesterRegistrationPage() {
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  async function loadRegistration() {
    try {
      const data = await academicService.getSemesterRegistration();

      setRegistration(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistration();
  }, []);

  async function handleRegister() {
    try {
      setRegistering(true);

      await academicService.registerSemester();

      await loadRegistration();

      alert("Semester Registration Submitted Successfully");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Semester Registration Failed");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading Semester Registration...</div>;
  }

  const getStatusColor = (status) => {
    if (status === "APPROVED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "REJECTED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Semester Registration</h1>

      <p className="text-gray-500 mb-8">
        Register for the upcoming semester and track approval status.
      </p>

      {!registration ? (
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Registration Open</h2>

            <p className="text-gray-500">
              You can now submit your semester registration request for the next
              semester.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-700 mb-2">
              Important Instructions
            </h3>

            <ul className="list-disc ml-5 text-sm text-blue-700 space-y-1">
              <li>Ensure your profile information is complete.</li>

              <li>Clear all pending fee dues before registration.</li>

              <li>Registration requests are subject to approval.</li>
            </ul>
          </div>

          <button
            onClick={handleRegister}
            disabled={registering}
            className={`px-6 py-3 rounded-lg text-white font-medium ${
              registering
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {registering ? "Submitting..." : "Register Semester"}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Current Semester</p>

              <h3 className="text-3xl font-bold mt-2">
                {registration.currentSemester}
              </h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Next Semester</p>

              <h3 className="text-3xl font-bold mt-2">
                {registration.nextSemester}
              </h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Status</p>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    registration.status,
                  )}`}
                >
                  {registration.status}
                </span>
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500 text-sm">Registered On</p>

              <h3 className="font-semibold mt-2">
                {new Date(registration.registeredAt).toLocaleDateString()}
              </h3>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Registration Request Submitted
              </h3>

              <p className="text-green-700">
                Your semester registration request has been submitted
                successfully and is awaiting approval from the administration
                department.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SemesterRegistrationPage;
