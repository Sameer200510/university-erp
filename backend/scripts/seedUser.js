const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

require("dotenv").config({
  path: "./src/config/.env",
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    {
      loginId: "ADMIN001",
      email: "admin@university.com",
      password: "Pass123",
      role: "SUPER_ADMIN",
    },
    {
      loginId: "ADM001",
      email: "admission@university.com",
      password: "Pass123",
      role: "ADMISSION_OFFICER",
    },
    {
      loginId: "STU001",
      email: "student@university.com",
      password: "Pass123",
      role: "STUDENT",
    },
    {
      loginId: "STU002",
      email: "student2@university.com",
      password: "Pass123",
      role: "STUDENT",
    },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({
      where: { loginId: u.loginId },
    });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);
      await prisma.user.create({
        data: {
          loginId: u.loginId,
          email: u.email,
          passwordHash,
          role: u.role,
          isFirstLogin: true,
        },
      });
      console.log(`Created user: ${u.loginId} with role ${u.role}`);
    } else {
      console.log(`User ${u.loginId} already exists`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
