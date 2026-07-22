import React, { useEffect, useState } from "react";
import examService from "../services/exam.service";
import ResultsTable from "../components/ResultsTable";

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    try {
      const data = await examService.getResults();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading Results...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Semester Results</h1>

      <ResultsTable results={results} />
    </div>
  );
}

export default ResultsPage;
