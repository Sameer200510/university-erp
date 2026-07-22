const prisma = require("../src/config/prisma");

function randomStatus() {
  const rand = Math.random();

  if (rand < 0.8) return "PRESENT";
  if (rand < 0.95) return "ABSENT";

  return "LEAVE";
}

async function seedAttendance() {
  try {
    console.log("🌱 Seeding Attendance...");

    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
    });

    const subjects = await prisma.subject.findMany();

    if (!students.length) {
      console.log("❌ No students found");
      return;
    }

    if (!subjects.length) {
      console.log("❌ No subjects found");
      return;
    }

    const attendanceData = [];

    for (const student of students) {
      for (const subject of subjects) {
        for (let day = 1; day <= 30; day++) {
          attendanceData.push({
            studentId: student.id,
            subjectId: subject.id,
            date: new Date(2026, 0, day),
            status: randomStatus(),
          });
        }
      }
    }

    await prisma.attendance.createMany({
      data: attendanceData,
      skipDuplicates: true,
    });

    console.log(`✅ Attendance Seeded (${attendanceData.length} records)`);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAttendance();
