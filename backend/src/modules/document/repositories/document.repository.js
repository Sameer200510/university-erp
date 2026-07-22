const prisma = require("../../../config/prisma");

class DocumentRepository {
  async getDocumentsByUserId(userId) {
    return await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async upsertDocument(userId, title, type, fileUrl) {
    const existingDocument = await prisma.document.findFirst({
      where: {
        userId,
        type,
      },
    });

    if (existingDocument) {
      return await prisma.document.update({
        where: {
          id: existingDocument.id,
        },
        data: {
          title,
          fileUrl,
          status: "PENDING",
        },
      });
    }

    return await prisma.document.create({
      data: {
        userId,
        title,
        type,
        fileUrl,
      },
    });
  }

  async deleteDocument(id, userId) {
    return await prisma.document.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}

module.exports = new DocumentRepository();
