const Joi = require('joi');

const contactsValidator = Joi.object({
  phoneNumber: Joi.string().min(10).max(10),
  email: Joi.string().email(),
});

module.exports = contactsValidator