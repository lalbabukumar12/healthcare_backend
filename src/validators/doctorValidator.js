const Joi = require('joi');
const { idParamSchema } = require('./patientValidator');

const phonePattern = /^\+?[0-9\-]{7,15}$/;

const createDoctorSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  specialization: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Specialization must be a string',
    'string.empty': 'Specialization cannot be empty',
    'string.min': 'Specialization must be at least 2 characters long',
    'string.max': 'Specialization cannot exceed 100 characters',
    'any.required': 'Specialization is required',
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  phone: Joi.string().trim().pattern(phonePattern).allow('', null).optional().messages({
    'string.pattern.base': 'Phone number must contain between 7 and 15 digits with optional + and dashes',
  }),
  experience_years: Joi.number().integer().min(0).max(70).optional().messages({
    'number.base': 'Experience years must be a number',
    'number.integer': 'Experience years must be an integer',
    'number.min': 'Experience years cannot be negative',
    'number.max': 'Experience years cannot exceed 70',
  }),
});

const updateDoctorSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
  }),
  specialization: Joi.string().trim().min(2).max(100).optional().messages({
    'string.base': 'Specialization must be a string',
    'string.empty': 'Specialization cannot be empty',
    'string.min': 'Specialization must be at least 2 characters long',
    'string.max': 'Specialization cannot exceed 100 characters',
  }),
  email: Joi.string().trim().lowercase().email().optional().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string().trim().pattern(phonePattern).allow('', null).optional().messages({
    'string.pattern.base': 'Phone number must contain between 7 and 15 digits with optional + and dashes',
  }),
  experience_years: Joi.number().integer().min(0).max(70).optional().messages({
    'number.base': 'Experience years must be a number',
    'number.integer': 'Experience years must be an integer',
    'number.min': 'Experience years cannot be negative',
    'number.max': 'Experience years cannot exceed 70',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

module.exports = {
  createDoctorSchema,
  updateDoctorSchema,
  idParamSchema,
};
