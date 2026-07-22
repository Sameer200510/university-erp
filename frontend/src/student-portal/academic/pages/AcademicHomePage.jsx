import React from "react";
import { useNavigate } from "react-router-dom";

function AcademicHomePage() {
  const navigate = useNavigate();

  const academicModules = [
    {
      title: "Attendance",
      description: "View subject-wise attendance records",
      path: "/student/academic/attendance",
    },
    {
      title: "Results",
      description: "View SGPA, CGPA and semester results",
      path: "/student/academic/results",
    },
    {
      title: "Subjects",
      description: "View enrolled subjects and credits",
      path: "/student/academic/subjects",
    },
    {
      title: "Semester Registration",
      description: "Register for upcoming semester",
      path: "/student/academic/semester-registration",
    },
    {
      title: "Feedback",
      description: "Submit faculty feedback",
      path: "/student/academic/feedback",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Academic Services</h1>

      <p className="text-gray-500 mb-8">
        Access all academic related services from here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {academicModules.map((module) => (
          <div
            key={module.title}
            onClick={() => navigate(module.path)}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer p-6 border"
          >
            <h2 className="text-xl font-semibold mb-2">{module.title}</h2>

            <p className="text-gray-500 text-sm">{module.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcademicHomePage;
