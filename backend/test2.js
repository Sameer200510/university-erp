const prisma = require('./src/config/prisma');
prisma.user.findMany().then(users => console.log('Users:', users)).catch(console.error).finally(() => prisma.$disconnect());
