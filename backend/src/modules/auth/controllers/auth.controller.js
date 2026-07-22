const authService = require("../services/auth.service");

class AuthController {
  async login(req, res) {
    try {
      const { userId, password } = req.body;

      const result = await authService.login(userId, password);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Current and new passwords are required" });
      }

      const result = await authService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMe(req, res) {
    res.status(200).json({ user: req.user });
  }

  // Development only - seed endpoint
  async seed(req, res) {
    try {
      const { email, password, role } = req.body;
      const user = await authService.seedUser(email, password, role);
      res.status(201).json({ message: "User seeded", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
