require("dotenv").config({
  path: "./src/config/.env",
});

const prisma = require("../src/config/prisma");

async function seedResults() {
  try {
    console.log("🔍 Finding Student...");

    const student = await prisma.user.findUnique({
      where: {
        loginId: "STU001",
      },
    });

    if (!student) {
      throw new Error("Student STU001 not found");
    }

    console.log("✅ Student Found:");
    console.log(student.id);

    console.log("🗑 Removing old result records...");

    await prisma.result.deleteMany({
      where: {
        studentId: student.id,
      },
    });

    console.log("🌱 Seeding Results...");

    await prisma.result.createMany({
      data: [
        {
          studentId: student.id,
          semester: 1,
          sgpa: 7.65,
          cgpa: 7.65,
          backPapers: 0,
          status: "PASS",
        },
        {
          studentId: student.id,
          semester: 2,
          sgpa: 7.21,
          cgpa: 7.43,
          backPapers: 0,
          status: "PASS",
        },
        {
          studentId: student.id,
          semester: 3,
          sgpa: 7.84,
          cgpa: 7.56,
          backPapers: 1,
          status: "PASS_WITH_BACK",
        },
        {
          studentId: student.id,
          semester: 4,
          sgpa: 8.12,
          cgpa: 7.7,
          backPapers: 0,
          status: "PASS",
        },
        {
          studentId: student.id,
          semester: 5,
          sgpa: 8.46,
          cgpa: 7.92,
          backPapers: 0,
          status: "PASS",
        },
      ],
    });

    console.log("✅ Results Seeded Successfully!");
  } catch (error) {
    console.error("❌ Seeding Failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedResults();
