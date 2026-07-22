const prisma = require("../../../config/prisma");

class StudentRepository {
  async getProfileByUserId(userId) {
    return await prisma.studentProfile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            loginId: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  async upsertProfile(userId, profileData) {
    return await prisma.studentProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });
  }

  async updatePhoto(userId, photoUrl) {
    return await prisma.studentProfile.update({
      where: {
        userId,
      },

      data: {
        photoUrl,
      },
    });
  }
}

module.exports = new StudentRepository();
