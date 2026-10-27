const Joi = require('joi');
const { idParamSchema } = require('./patientValidator');

const createMappingSchema = Joi.object({
  patientId: Joi.number().integer().positive().required().messages({
    'number.base': 'Patient ID must be a number',
    'number.integer': 'Patient ID must be an integer',
    'number.positive': 'Patient ID must be a positive integer',
    'any.required': 'Patient ID is required',
  }),
  doctorId: Joi.number().integer().positive().required().messages({
    'number.base': 'Doctor ID must be a number',
    'number.integer': 'Doctor ID must be an integer',
    'number.positive': 'Doctor ID must be a positive integer',
    'any.required': 'Doctor ID is required',
  }),
});

const patientIdParamSchema = Joi.object({
  patient_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Patient ID must be a number',
    'number.integer': 'Patient ID must be an integer',
    'number.positive': 'Patient ID must be a positive integer',
    'any.required': 'Patient ID is required',
  }),
});

module.exports = {
  createMappingSchema,
  patientIdParamSchema,
  idParamSchema,
};
