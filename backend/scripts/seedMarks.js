const prisma = require("../src/config/prisma");

async function seedMarks() {
  try {
    console.log("🌱 Seeding Marks...");

    const subjects = await prisma.subject.findMany();

    if (subjects.length === 0) {
      console.log("❌ No subjects found");
      return;
    }

    await prisma.marks.createMany({
      data: [
        {
          studentId: "STU001",
          subjectId: subjects[0].id,
          semester: 1,
          examType: "MID_SEM",
          marksType: "THEORY",
          marks: 24,
        },
        {
          studentId: "STU001",
          subjectId: subjects[1].id,
          semester: 1,
          examType: "MID_SEM",
          marksType: "THEORY",
          marks: 22,
        },
        {
          studentId: "STU001",
          subjectId: subjects[2].id,
          semester: 1,
          examType: "MID_SEM",
          marksType: "THEORY",
          marks: 27,
        },
        {
          studentId: "STU001",
          subjectId: subjects[3].id,
          semester: 1,
          examType: "MID_SEM",
          marksType: "THEORY",
          marks: 25,
        },
      ],
    });

    console.log("✅ Marks Seeded Successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMarks();
