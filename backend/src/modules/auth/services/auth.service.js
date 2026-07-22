const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const authRepository = require("../repositories/auth.repository");

class AuthService {
  async crossQueryCollegeErp(loginId) {
    const client = new Client({
      connectionString: 'postgresql://postgres:postgres@127.0.0.1:5440/admission_db?schema=public&sslmode=disable'
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
      // console.error("Error cross-querying college_erp:", err);
      return null;
    } finally {
      await client.end();
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
      throw new Error("Invalid user ID or password");
    }

    if (user.status !== "ACTIVE") {
      throw new Error("Account is not active");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new Error("Invalid user ID or password");
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
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (!strongPassword.test(newPassword)) {
      throw new Error("Password must contain uppercase, lowercase and number");
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
