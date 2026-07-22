const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generateAdmitCardPdf({ student, semester, subjects }) {
  const fileName = `ADMIT-${Date.now()}.pdf`;

  const filePath = path.join(
    __dirname,
    "../../../../uploads/admit-cards",
    fileName,
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
  });

  doc.pipe(fs.createWriteStream(filePath));

  // HEADER

  doc.fontSize(22).font("Helvetica-Bold").text("GRAPHIC ERA UNIVERSITY", {
    align: "center",
  });

  doc.moveDown(0.5);

  doc.fontSize(16).font("Helvetica-Bold").text("EXAMINATION ADMIT CARD", {
    align: "center",
  });

  doc.moveDown(2);

  // STUDENT DETAILS

  doc.fontSize(12).font("Helvetica");

  doc.text(`Student Name : ${student.firstName} ${student.lastName}`);

  doc.text(`Enrollment No : ${student.enrollmentNo || "N/A"}`);

  doc.text(`Roll Number : ${student.rollNo || "N/A"}`);

  doc.text(`Course : ${student.course || "N/A"}`);

  doc.text(`Branch : ${student.branch || "N/A"}`);

  doc.text(`Semester : ${semester}`);

  doc.moveDown(2);

  // TABLE

  let y = doc.y;

  doc.rect(40, y, 520, 25).stroke();

  doc.font("Helvetica-Bold");

  doc.text("Subject", 50, y + 7);

  doc.text("Attendance", 320, y + 7);

  doc.text("Status", 450, y + 7);

  y += 25;

  doc.font("Helvetica");

  subjects.forEach((subject) => {
    doc.rect(40, y, 520, 25).stroke();

    doc.text(subject.subjectName, 50, y + 7);

    doc.text(`${subject.percentage}%`, 330, y + 7);

    doc.text(subject.status, 450, y + 7);

    y += 25;
  });

  doc.moveDown();

  doc.y = y + 30;

  doc.font("Helvetica-Bold");

  doc.text(
    "NOTE : Students marked DEBARRED are not eligible for examination in those subjects.",
  );

  doc.moveDown(4);

  doc.text("Controller of Examination", {
    align: "right",
  });

  doc.text("Graphic Era University", {
    align: "right",
  });

  doc.end();

  return `/uploads/admit-cards/${fileName}`;
}

module.exports = {
  generateAdmitCardPdf,
};
