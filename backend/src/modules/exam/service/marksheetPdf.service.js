const PDFDocument = require("pdfkit");
const examRepository = require("../repositories/exam.repository");

async function generate(studentId, semester, res) {
  const student = await examRepository.getStudentProfile(studentId);

  const result = await examRepository.getSemesterResult(studentId, semester);

  const marks = await examRepository.getSemesterMarks(studentId, semester);

  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Semester-${semester}-Marksheet.pdf`,
  );

  doc.pipe(res);

  // HEADER

  doc
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("GRAPHIC ERA DEEMED TO BE UNIVERSITY", {
      align: "center",
    });

  doc.moveDown(0.5);

  doc.fontSize(16).font("Helvetica-Bold").text("STATEMENT OF MARKS", {
    align: "center",
  });

  doc.fontSize(14).font("Helvetica").text(`Semester ${semester}`, {
    align: "center",
  });

  doc.moveDown(1.5);

  // STUDENT DETAILS

  doc.fontSize(11);

  doc.text(
    `Student Name : ${student.firstName || ""} ${student.lastName || ""}`,
  );

  doc.text(`Enrollment No : ${student.enrollmentNo || "-"}`);

  doc.text(`Roll Number : ${student.rollNo || "-"}`);

  doc.text(`Course : ${student.course || "-"}`);

  doc.text(`Branch : ${student.branch || "-"}`);

  doc.moveDown(1.5);

  // TABLE HEADER

  let y = doc.y;

  doc.rect(40, y, 515, 30).stroke();

  doc.font("Helvetica-Bold");

  doc.text("Code", 50, y + 8);

  doc.text("Subject Name", 110, y + 8);

  doc.text("Exam", 330, y + 8);

  doc.text("Marks", 470, y + 8);

  y += 30;

  // MARKS ROWS

  doc.font("Helvetica");

  marks.forEach((item) => {
    doc.rect(40, y, 515, 28).stroke();

    doc.text(item.subject?.code || "-", 50, y + 8, {
      width: 50,
    });

    doc.text(item.subject?.name || "-", 110, y + 8, {
      width: 200,
    });

    doc.text(item.examType || "-", 330, y + 8, {
      width: 120,
    });

    doc.text(String(item.marks), 480, y + 8);

    y += 28;
  });

  // RESULT SUMMARY

  y += 20;

  doc.y = y;

  doc.moveDown();

  doc.font("Helvetica-Bold");

  doc.text(`SGPA : ${result?.sgpa ?? "-"}`);

  doc.text(`CGPA : ${result?.cgpa ?? "-"}`);

  doc.text(`Back Papers : ${result?.backPapers ?? 0}`);

  doc.text(`Result Status : ${result?.status ?? "-"}`);

  doc.moveDown(4);

  doc.text("Controller of Examination", {
    align: "right",
  });

  doc.text("Graphic Era University", {
    align: "right",
  });

  doc.end();
}

module.exports = {
  generate,
};
