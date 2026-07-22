import React, { useEffect, useState } from "react";
import examService from "../services/exam.service";
import MarksTable from "../components/MarksTable";

function MarksPage() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarks();
  }, []);

  async function loadMarks() {
    try {
      const data = await examService.getMarks();
      setMarks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading Marks...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Marks Statement</h1>

      <MarksTable marks={marks} />
    </div>
  );
}

export default MarksPage;
