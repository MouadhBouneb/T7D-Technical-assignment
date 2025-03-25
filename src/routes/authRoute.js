const express = require("express");
const AuthController = require("../controllers/authController");
const {
  validateRequest,
  userValidation,
} = require("../middlewares/validation");

const router = express.Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest(userValidation.register),
  authController.register
);
router.post(
  "/login",
  validateRequest(userValidation.login),
  authController.login
);

module.exports = router;
