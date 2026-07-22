const prisma = require("../../../config/prisma");

async function getAll() {
  return prisma.circular.findMany({
    orderBy: [
      {
        isPinned: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

async function getById(id) {
  return prisma.circular.findUnique({
    where: {
      id,
    },
  });
}

async function create(data) {
  return prisma.circular.create({
    data,
  });
}

module.exports = {
  getAll,
  getById,
  create,
};
