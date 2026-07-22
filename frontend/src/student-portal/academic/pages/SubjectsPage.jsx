import React, { useEffect, useState } from "react";
import { academicService } from "../services/academic.service";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await academicService.getSubjects();

        setSubjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  if (loading) {
    return <div className="p-6">Loading Subjects...</div>;
  }

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + subject.credits,
    0,
  );

  const semesters = [...new Set(subjects.map((s) => s.semester))];

  const facultyCount = new Set(subjects.map((s) => s.facultyName)).size;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Subjects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm text-gray-500">Total Subjects</h3>

          <p className="text-3xl font-bold text-blue-600">{subjects.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm text-gray-500">Current Semester</h3>

          <p className="text-3xl font-bold text-green-600">
            {Math.max(...semesters)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm text-gray-500">Total Credits</h3>

          <p className="text-3xl font-bold text-purple-600">{totalCredits}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-sm text-gray-500">Faculty Members</h3>

          <p className="text-3xl font-bold text-orange-600">{facultyCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Code</th>

              <th className="p-4 text-left">Subject</th>

              <th className="p-4 text-left">Credits</th>

              <th className="p-4 text-left">Semester</th>

              <th className="p-4 text-left">Faculty</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{subject.code}</td>

                <td className="p-4">{subject.name}</td>

                <td className="p-4">{subject.credits}</td>

                <td className="p-4">Semester {subject.semester}</td>

                <td className="p-4">{subject.facultyName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubjectsPage;
