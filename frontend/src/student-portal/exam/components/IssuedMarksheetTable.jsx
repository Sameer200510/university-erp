function IssuedMarksheetTable({ marksheets }) {
  if (!marksheets?.length) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        No Marksheets Available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3">Semester</th>
            <th className="p-3">Issued Date</th>
            <th className="p-3">Document</th>
          </tr>
        </thead>

        <tbody>
          {marksheets.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.semester}</td>

              <td className="p-3">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3">
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600"
                  >
                    Download
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IssuedMarksheetTable;
