const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

async function seedFinanceOfficer() {
  console.log("Seeding Finance Officer (`FIN001`) into Neon PostgreSQL...");

  const passwordHash = await bcrypt.hash("Pass123", 10);

  const user = await prisma.user.upsert({
    where: { loginId: "FIN001" },
    update: {
      passwordHash,
      role: "FINANCE_OFFICER",
      status: "ACTIVE",
    },
    create: {
      loginId: "FIN001",
      email: "finance@university.edu",
      passwordHash,
      role: "FINANCE_OFFICER",
      status: "ACTIVE",
      isFirstLogin: false,
    },
  });

  console.log("✔ Finance Officer seeded successfully:", user.loginId, "| Role:", user.role);
}

seedFinanceOfficer()
  .catch((e) => {
    console.error("Error seeding Finance Officer:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
