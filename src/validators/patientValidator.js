const Joi = require('joi');

const phonePattern = /^\+?[0-9\-]{7,15}$/;

const createPatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  age: Joi.number().integer().min(0).max(150).required().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'Age cannot be negative',
    'number.max': 'Age cannot exceed 150',
    'any.required': 'Age is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': 'Gender must be one of: male, female, other',
    'any.required': 'Gender is required',
  }),
  phone: Joi.string().trim().pattern(phonePattern).allow('', null).optional().messages({
    'string.pattern.base': 'Phone number must contain between 7 and 15 digits with optional + and dashes',
  }),
  address: Joi.string().trim().allow('', null).optional().messages({
    'string.base': 'Address must be a string',
  }),
  medical_history: Joi.string().trim().allow('', null).optional().messages({
    'string.base': 'Medical history must be a string',
  }),
});

const updatePatientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  age: Joi.number().integer().min(0).max(150).optional().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'Age cannot be negative',
    'number.max': 'Age cannot exceed 150',
  }),
  gender: Joi.string().valid('male', 'female', 'other').optional().messages({
    'any.only': 'Gender must be one of: male, female, other',
  }),
  phone: Joi.string().trim().pattern(phonePattern).allow('', null).optional().messages({
    'string.pattern.base': 'Phone number must contain between 7 and 15 digits with optional + and dashes',
  }),
  address: Joi.string().trim().allow('', null).optional().messages({
    'string.base': 'Address must be a string',
  }),
  medical_history: Joi.string().trim().allow('', null).optional().messages({
    'string.base': 'Medical history must be a string',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID must be a number',
    'number.integer': 'ID must be an integer',
    'number.positive': 'ID must be a positive integer',
    'any.required': 'ID is required',
  }),
});

module.exports = {
  createPatientSchema,
  updatePatientSchema,
  idParamSchema,
};
