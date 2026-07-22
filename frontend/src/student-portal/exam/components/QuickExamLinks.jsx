import { Link } from "react-router-dom";

function QuickExamLinks() {
  const links = [
    {
      title: "Admit Card",
      description: "Check Admit Card Eligibility",
      path: "/student/exam/admit-card",
    },
    {
      title: "Results",
      description: "View Semester Results",
      path: "/student/exam/results",
    },
    {
      title: "Marks",
      description: "View Subject-wise Marks",
      path: "/student/exam/marks",
    },
    {
      title: "Marksheets",
      description: "Download Issued Marksheets",
      path: "/student/exam/marksheets",
    },
    {
      title: "Back Papers",
      description: "Apply for Back Paper Exams",
      path: "/student/exam/back-papers",
    },
    {
      title: "Subject Revaluation",
      description: "Apply for Subject Revaluation",
      path: "/student/exam/revaluation",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {links.map((item) => (
        <Link
          key={item.title}
          to={item.path}
          className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

          <p className="text-gray-500">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}

export default QuickExamLinks;
