import examService from "../services/exam.service";

function MarksheetTable({ marksheets }) {
  async function handleDownload(semester) {
    try {
      const blob = await examService.downloadMarksheet(semester);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `Semester-${semester}-Marksheet.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert("Unable to download marksheet");
    }
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-4 text-left">Semester</th>
            <th className="p-4 text-left">Download</th>
          </tr>
        </thead>

        <tbody>
          {marksheets.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-4">Semester {item.semester}</td>

              <td className="p-4">
                <button
                  onClick={() => handleDownload(item.semester)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarksheetTable;
