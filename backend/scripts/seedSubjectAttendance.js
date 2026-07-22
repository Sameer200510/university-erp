require("dotenv").config({
  path: "./src/config/.env",
});

const prisma = require("../src/config/prisma");

async function seedSubjectAttendance() {
  try {
    console.log("⏳ Seeding Subject Attendance...");

    await prisma.subjectAttendanceSummary.deleteMany();

    const students = [
      "cc5293e6-ac73-4919-9708-452381d1fa44", // STU001
      "513e1597-1882-4398-91b2-5e290e099204", // STU002
    ];

    const attendanceData = [
      {
        subjectId: "820ca1c5-960b-43bb-ab59-2b2590fb851c",
        percentage: 82,
      },
      {
        subjectId: "43a74b27-e7ee-4be6-b739-881c91b32a9a",
        percentage: 68,
      },
      {
        subjectId: "bdb1ab44-5b47-4b80-af2c-8252c89a4682",
        percentage: 73,
      },
      {
        subjectId: "81deb388-81e7-467e-9622-6721ecdad3f1",
        percentage: 91,
      },
      {
        subjectId: "5b7d3c52-06e3-4419-93be-1449c0902be1",
        percentage: 78,
      },
      {
        subjectId: "7496c1ee-19ea-4263-9a39-4405864dd098",
        percentage: 88,
      },
      {
        subjectId: "dd545bc0-d940-43ce-898c-1fe7afe5575d",
        percentage: 70,
      },
      {
        subjectId: "0c2b523f-c9f2-4004-9ff2-d29c8395b990",
        percentage: 84,
      },
    ];

    for (const studentId of students) {
      for (const item of attendanceData) {
        await prisma.subjectAttendanceSummary.create({
          data: {
            studentId,
            subjectId: item.subjectId,

            semester: 6,

            totalClasses: 100,

            attendedClasses: item.percentage,

            percentage: item.percentage,
          },
        });
      }
    }

    console.log("✅ Subject Attendance Seeded");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSubjectAttendance();
