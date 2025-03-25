const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const AppError = require("../utils/AppError");

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    // Check if email already exists
    if (await this.userRepository.findByEmail(userData.email)) {
      throw new AppError("Email already in use", 400);
    }

    // Create new user
    const newUser = await this.userRepository.create({
      ...userData,
      createdBy: userData.id || "system",
    });

    // Generate JWT token
    const token = this._signToken(newUser._id);

    // Return user data without password
    const user = newUser.toObject();
    delete user.password;

    return { user, token };
  }

  async login(email, password) {
    // Check if user exists and password is correct
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    // Generate JWT token
    const token = this._signToken(user._id);

    // Return user data without password
    const userData = user.toObject();
    delete userData.password;

    return { user: userData, token };
  }

  _signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }
}

module.exports = AuthService;
