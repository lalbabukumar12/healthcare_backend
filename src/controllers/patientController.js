const { Patient, Doctor } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendSuccess = require('../utils/response');

const findPatientAndCheckOwnership = async (id, userId, options = {}) => {
  const patient = await Patient.findByPk(id, options);
  if (!patient) {
    throw ApiError.notFound('Patient not found');
  }
  if (patient.createdBy !== userId) {
    throw ApiError.forbidden('You do not have access to this patient');
  }
  return patient;
};

const createPatient = asyncHandler(async (req, res) => {
  const patient = await Patient.create({
    ...req.body,
    createdBy: req.user.id,
  });

  return sendSuccess(res, 201, patient, 'Patient created successfully');
});

const getPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.findAll({
    where: { createdBy: req.user.id },
    order: [['createdAt', 'DESC']],
  });

  return sendSuccess(res, 200, patients, 'Patients retrieved successfully');
});

const getPatientById = asyncHandler(async (req, res) => {
  const patient = await findPatientAndCheckOwnership(req.params.id, req.user.id, {
    include: [
      {
        model: Doctor,
        as: 'doctors',
        attributes: ['id', 'name', 'specialization'],
        through: { attributes: [] },
      },
    ],
  });

  return sendSuccess(res, 200, patient, 'Patient retrieved successfully');
});

const updatePatient = asyncHandler(async (req, res) => {
  const patient = await findPatientAndCheckOwnership(req.params.id, req.user.id);
  await patient.update(req.body);

  return sendSuccess(res, 200, patient, 'Patient updated successfully');
});

const deletePatient = asyncHandler(async (req, res) => {
  const patient = await findPatientAndCheckOwnership(req.params.id, req.user.id);
  await patient.destroy();

  return sendSuccess(res, 200, null, 'Patient deleted successfully');
});

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
