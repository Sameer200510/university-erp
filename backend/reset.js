const bcrypt = require('bcrypt');
const prisma = require('./src/config/prisma');

async function reset() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Pass123', salt);
  await prisma.user.update({
    where: { loginId: 'ADM001' },
    data: { passwordHash, isFirstLogin: false }
  });
  console.log('Password reset to Pass123');
}

reset().catch(console.error).finally(() => prisma.$disconnect());
