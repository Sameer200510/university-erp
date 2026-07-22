function ExamStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Current Semester</p>

        <h2 className="text-4xl font-bold mt-2">{stats.currentSemester}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">SGPA</p>

        <h2 className="text-4xl font-bold text-blue-600 mt-2">{stats.sgpa}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">CGPA</p>

        <h2 className="text-4xl font-bold text-green-600 mt-2">{stats.cgpa}</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">Back Papers</p>

        <h2 className="text-4xl font-bold text-red-600 mt-2">
          {stats.backPapers}
        </h2>
      </div>
    </div>
  );
}

export default ExamStatsCards;
