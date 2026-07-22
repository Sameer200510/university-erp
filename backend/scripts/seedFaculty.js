const prisma = require("../src/config/prisma");

async function seedFaculty() {
  try {
    await prisma.faculty.createMany({
      data: [
        {
          name: "Dr. Vishu Tyagi",
          department: "CSE",
        },
        {
          name: "Dr. Rohan Verma",
          department: "CSE",
        },
        {
          name: "Dr. Darshan Singh",
          department: "CSE",
        },
        {
          name: "Dr. Ankit Sharma",
          department: "CSE",
        },
        {
          name: "Dr. Amit Kumar",
          department: "CSE",
        },
        {
          name: "Dr. Priya Sharma",
          department: "CSE",
        },
        {
          name: "Dr. Neeraj Pandey",
          department: "CSE",
        },
        {
          name: "Dr. Sakshi Gupta",
          department: "CSE",
        },
      ],
    });

    console.log("✅ Faculty Seeded");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFaculty();
