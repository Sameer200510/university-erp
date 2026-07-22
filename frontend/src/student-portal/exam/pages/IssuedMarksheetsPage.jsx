import { useEffect, useState } from "react";

import examService from "../services/exam.service";

import MarksheetTable from "../components/MarksheetTable";

function IssuedMarksheetsPage() {
  const [marksheets, setMarksheets] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await examService.getMarksheets();

      setMarksheets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Issued Marksheets</h1>

      <MarksheetTable marksheets={marksheets} />
    </div>
  );
}

export default IssuedMarksheetsPage;
