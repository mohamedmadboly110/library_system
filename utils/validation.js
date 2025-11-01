const Joi = require('joi');

// User validation schemas
exports.registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
    }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
    }),
    role: Joi.string().valid('user', 'admin').optional() // 👈 أضف ده

});

exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required',
    }),
});

// Book validation schemas
exports.createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Title is required',
      'string.max': 'Title must not exceed 200 characters',
    }),
  author: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'Author is required',
      'string.max': 'Author name must not exceed 100 characters',
    }),
  description: Joi.string().trim().min(10).max(2000).required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters',
      'string.max': 'Description must not exceed 2000 characters',
    }),
});

exports.updateBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  author: Joi.string().trim().min(1).max(100).optional(),
  description: Joi.string().trim().min(10).max(2000).optional(),
});

// Validation middleware
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
    }
    
    next();
  };
};


