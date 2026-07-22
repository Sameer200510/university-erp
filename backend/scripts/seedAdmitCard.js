require("dotenv").config({
  path: "./src/config/.env",
});

const prisma = require("../src/config/prisma");

async function seedAdmitCard() {
  try {
    await prisma.admitCardConfig.deleteMany();

    await prisma.admitCardConfig.create({
      data: {
        minimumAttendance: 75,
        isReleased: false,
      },
    });

    console.log("✅ Admit Card Config Seeded");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmitCard();
