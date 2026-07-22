import { useEffect, useState } from "react";

import revaluationService from "../services/revaluation.service";

import RevaluationTable from "../components/RevaluationTable";

function RevaluationPage() {
  const [subjects, setSubjects] = useState([]);

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    subjectId: "",
    semester: "",
    reason: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const subjectsData = await revaluationService.getSubjects();

      const applicationsData = await revaluationService.getApplications();

      setSubjects(subjectsData);

      setApplications(applicationsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await revaluationService.apply(form);

      alert("Revaluation Applied Successfully");

      loadData();

      setForm({
        subjectId: "",
        semester: "",
        reason: "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Subject Revaluation</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <select
          className="w-full border p-3 rounded"
          value={form.subjectId}
          onChange={(e) =>
            setForm({
              ...form,
              subjectId: e.target.value,
            })
          }
        >
          <option value="">Select Subject</option>

          {subjects.map((item) => (
            <option key={item.subject.id} value={item.subject.id}>
              {item.subject.code} - {item.subject.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Semester"
          value={form.semester}
          onChange={(e) =>
            setForm({
              ...form,
              semester: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

        <textarea
          placeholder="Reason"
          value={form.reason}
          onChange={(e) =>
            setForm({
              ...form,
              reason: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded"
          type="submit"
        >
          Apply Revaluation
        </button>
      </form>

      <RevaluationTable applications={applications} />
    </div>
  );
}

export default RevaluationPage;
