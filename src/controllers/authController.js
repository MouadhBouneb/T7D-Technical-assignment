const asyncHandler = require("express-async-handler");
const AuthService = require("../services/authService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = asyncHandler(async (req, res, next) => {
    const { user, token } = await this.authService.register({
      ...req.body,
      balance: 0,
    });

    res.status(201).json({
      status: "success",
      token,
      data: { ...user },
    });
  });

  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { user, token } = await this.authService.login(email, password);

    res.status(200).json({
      status: "success",
      token,
      data: { ...user },
    });
  });
}

module.exports = AuthController;
