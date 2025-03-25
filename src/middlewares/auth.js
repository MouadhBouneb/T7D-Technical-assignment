const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const AppError = require("../utils/AppError");

const userRepo = new UserRepository();

module.exports = {
  protect: async (req, res, next) => {
    try {
      // 1) Get token and check if it exists
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        );
      }

      // 2) Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3) Check if user still exists
      const currentUser = await userRepo.findById(decoded.id);
      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            401
          )
        );
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      req.user = currentUser;
      next();
    } catch (err) {
      next(err);
    }
  },

  restrictTo: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }

      next();
    };
  },
};
