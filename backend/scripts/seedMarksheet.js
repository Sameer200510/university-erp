const prisma = require("../src/config/prisma");

async function main() {
  await prisma.marksheet.createMany({
    data: [
      {
        studentId: "cc5293e6-ac73-4919-9708-452381d1fa44",
        semester: 1,
        pdfUrl: "/uploads/marksheets/semester1.pdf",
      },
      {
        studentId: "cc5293e6-ac73-4919-9708-452381d1fa44",
        semester: 2,
        pdfUrl: "/uploads/marksheets/semester2.pdf",
      },
      {
        studentId: "cc5293e6-ac73-4919-9708-452381d1fa44",
        semester: 3,
        pdfUrl: "/uploads/marksheets/semester3.pdf",
      },
    ],
  });

  console.log("Marksheets Seeded");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
