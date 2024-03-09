const Joi = require("joi");

// Define a schema for the request body
exports.registrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  mobile: Joi.string().min(10).max(13).required(),
  password: Joi.string().min(6).required(),
});
