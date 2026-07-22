import { useEffect, useState } from "react";
import examService from "../services/exam.service";
import BackPapersTable from "../components/BackPapersTable";

function BackPapersPage() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    semester: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await examService.getBackPapers();
      setPapers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await examService.applyBackPaper(form);

      alert("Back Paper Applied Successfully");

      setForm({
        subjectCode: "",
        subjectName: "",
        semester: "",
      });

      loadData();
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Back Paper Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Application Fee</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">₹1500</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Applied Papers</p>
          <h2 className="text-3xl font-bold mt-2">{papers.length}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500">Pending Applications</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {papers.filter((p) => p.status === "PENDING").length}
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">Apply Back Paper</h2>

        <input
          type="text"
          placeholder="Subject Code"
          value={form.subjectCode}
          onChange={(e) =>
            setForm({
              ...form,
              subjectCode: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Subject Name"
          value={form.subjectName}
          onChange={(e) =>
            setForm({
              ...form,
              subjectName: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

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

        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          Apply
        </button>
      </form>

      <BackPapersTable papers={papers} />
    </div>
  );
}

export default BackPapersPage;
