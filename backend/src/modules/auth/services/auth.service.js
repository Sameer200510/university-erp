const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const authRepository = require("../repositories/auth.repository");
const AppError = require("../../../utils/AppError");

class AuthService {
  async crossQueryCollegeErp(loginId) {
    if (!process.env.ADMISSION_DB_URL) {
      return null;
    }
    const client = new Client({
      connectionString: process.env.ADMISSION_DB_URL,
    });
    try {
      await client.connect();
      // 1. Check if Admission Admin/Officer (by email)
      let res = await client.query('SELECT * FROM "User" WHERE email = $1 AND role::text IN (\'ADMISSION_ADMIN\', \'COUNSELOR\', \'SUPER_ADMIN\')', [loginId]);
      if (res.rows.length > 0) {
        return { source: 'college_erp', type: 'ADMIN', user: res.rows[0] };
      }
      
      // 2. Check if Student (by erpId)
      const profileRes = await client.query('SELECT p."userId", p."erpId", p."courseId", u."firstName", u."lastName" FROM "StudentProfile" p JOIN "User" u ON p."userId" = u.id WHERE p."erpId" = $1', [loginId]);
      if (profileRes.rows.length > 0) {
        const userId = profileRes.rows[0].userId;
        res = await client.query('SELECT * FROM "User" WHERE id = $1', [userId]);
        if (res.rows.length > 0) {
          return { source: 'college_erp', type: 'STUDENT', user: res.rows[0], profile: profileRes.rows[0] };
        }
      }
      return null;
    } catch (err) {
      return null;
    } finally {
      try { await client.end(); } catch (e) {}
    }
  }

  async login(loginId, password) {
    let user = await authRepository.findUserByLoginId(loginId);

    // Cross-query integration
    if (!user) {
      const collegeErpData = await this.crossQueryCollegeErp(loginId);
      if (collegeErpData) {
        // Verify password
        const isMatchPlain = (password === collegeErpData.user.password);
        let isMatchHash = false;
        try { isMatchHash = await bcrypt.compare(password, collegeErpData.user.password); } catch(e){}
        
        if (isMatchPlain || isMatchHash) {
          // Passwords match, auto-migrate to erp_core
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);
          
          if (collegeErpData.type === 'ADMIN') {
            user = await authRepository.createUser({
              loginId: collegeErpData.user.email,
              email: collegeErpData.user.email,
              passwordHash,
              role: 'ADMISSION_OFFICER',
              status: 'ACTIVE',
              isFirstLogin: false
            });
          } else if (collegeErpData.type === 'STUDENT') {
            user = await authRepository.createStudentUser({
              loginId: loginId,
              email: collegeErpData.user.email,
              passwordHash,
              role: 'STUDENT',
              status: 'ACTIVE',
              isFirstLogin: true
            }, {
              firstName: collegeErpData.profile.firstName || collegeErpData.user.firstName,
              lastName: collegeErpData.profile.lastName || collegeErpData.user.lastName,
              enrollmentNo: loginId,
              course: collegeErpData.profile.courseId
            });
          }
        }
      }
    }

    if (!user) {
      throw new AppError("Invalid user ID or password", 401);
    }

    if (user.status !== "ACTIVE") {
      throw new AppError("Account is not active", 403);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new AppError("Invalid user ID or password", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        sub: user.id,
        email: user.email || user.loginId,
        loginId: user.loginId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return {
      token,
      user: {
        id: user.id,
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        status: user.status,
        isFirstLogin: user.isFirstLogin,
      },
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      throw new AppError("Incorrect current password", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("Password must be at least 8 characters long", 400);
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (!strongPassword.test(newPassword)) {
      throw new AppError("Password must contain uppercase, lowercase and number", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await authRepository.updateUserPassword(userId, passwordHash, false);

    return {
      success: true,
      message: "Password updated successfully",
    };
  }

  async seedUser(loginId, password, role) {
    const existingUser = await authRepository.findUserByLoginId(loginId);

    if (existingUser) {
      return existingUser;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return await authRepository.createUser({
      loginId,
      passwordHash,
      role,
    });
  }
}

module.exports = new AuthService();
