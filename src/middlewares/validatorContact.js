const Joi = require('joi')

const shemaAddContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['ua', 'gmail', 'com', 'net', 'org'] }, })
    .required(),
  phone: Joi.string()
    .pattern(/[()][0-9]{3}[)] [0-9]{3}-[0-9]{4}/)
    .required(),
})

const shemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'gmail', 'ua', 'org'] }, })
    .optional(),
  phone: Joi.string()
    .pattern(/[()][0-9]{3}[)] [0-9]{3}-[0-9]{4}/)
    .required(),
}).or('name', 'emaill', 'phone')

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    next()
  } catch (err) {
    next({ status: 400, message: err.message.replace(/"/g, '') })
  }
}

module.exports = {
  addValidationContact: (req, res, next) => {
    return validate(shemaAddContact, req.body, next)
  },
  updateValidationContact: (req, res, next) => {
    return validate(shemaUpdateContact, req.body, next)
  },
}
