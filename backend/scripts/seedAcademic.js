const prisma = require("../src/config/prisma");

async function seedAcademic() {
  try {
    console.log("🌱 Seeding Subjects...");

    await prisma.subject.createMany({
      data: [
        {
          code: "CSE301",
          name: "Database Management System",
          semester: 5,
          credits: 4,
          facultyName: "Dr. Vishu Tyagi",
        },
        {
          code: "CSE302",
          name: "Operating Systems",
          semester: 5,
          credits: 4,
          facultyName: "Dr. Rohan Verma",
        },
        {
          code: "CSE303",
          name: "Computer Networks",
          semester: 5,
          credits: 3,
          facultyName: "Dr. Darshan Singh",
        },
        {
          code: "CSE304",
          name: "Design and Analysis of Algorithms",
          semester: 5,
          credits: 4,
          facultyName: "Dr. Ankit Sharma",
        },
        {
          code: "CSE305",
          name: "Software Engineering",
          semester: 5,
          credits: 3,
          facultyName: "Dr. Amit Kumar",
        },
        {
          code: "CSE401",
          name: "Machine Learning",
          semester: 6,
          credits: 4,
          facultyName: "Dr. Priya Sharma",
        },
        {
          code: "CSE402",
          name: "Compiler Design",
          semester: 6,
          credits: 4,
          facultyName: "Dr. Neeraj Pandey",
        },
        {
          code: "CSE403",
          name: "Cloud Computing",
          semester: 6,
          credits: 3,
          facultyName: "Dr. Sakshi Gupta",
        },
      ],
      skipDuplicates: true,
    });

    console.log("✅ Subjects Seeded Successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAcademic();
