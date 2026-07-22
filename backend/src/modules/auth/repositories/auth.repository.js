const prisma = require("../../../config/prisma");

class AuthRepository {
  async findUserByLoginId(loginId) {
    return await prisma.user.findUnique({
      where: { loginId },
    });
  }

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserWithProfile(id) {
    return await prisma.user.findUnique({
      where: { id },

      include: {
        studentProfile: true,
      },
    });
  }

  async updateUserPassword(id, newPasswordHash, isFirstLogin) {
    return await prisma.user.update({
      where: { id },
      data: {
        passwordHash: newPasswordHash,
        isFirstLogin: isFirstLogin,
      },
    });
  }

  // Method to create a seed user easily
  async createUser(data) {
    return await prisma.user.create({
      data,
    });
  }

  async createStudentUser(userData, profileData) {
    return await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: userData,
      });

      const profile = await prisma.studentProfile.create({
        data: {
          ...profileData,
          userId: user.id,
        },
      });

      return { ...user, studentProfile: profile };
    });
  }
}

module.exports = new AuthRepository();
