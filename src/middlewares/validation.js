const Joi = require("joi");
const AppError = require("../utils/AppError");

const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return next(new AppError(`Validation error: ${errors.join(", ")}`, 400));
    }
    console.log("req");
    next();
  };
};

// User validation schemas
const userValidation = {
  register: Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    passwordConfirm: Joi.string().valid(Joi.ref("password")).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Voucher validation schemas
const voucherValidation = {
  create: Joi.object({
    name: Joi.string().required().min(3).max(100),
    value: Joi.number().required().min(1),
    expiryDate: Joi.date().greater("now").required(),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    value: Joi.number().min(1).optional(),
    expiryDate: Joi.date().greater("now").optional(),
    status: Joi.string().valid("active", "redeemed", "expired").optional(),
  }),
};

module.exports = {
  validateRequest,
  userValidation,
  voucherValidation,
};
