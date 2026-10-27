const { Mapping, Patient, Doctor } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendSuccess = require('../utils/response');

const createMapping = asyncHandler(async (req, res) => {
  const { patientId, doctorId } = req.body;

  const patient = await Patient.findByPk(patientId);
  if (!patient) {
    throw ApiError.notFound('Patient not found');
  }
  if (patient.createdBy !== req.user.id) {
    throw ApiError.forbidden('You can only assign doctors to your own patients');
  }

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor) {
    throw ApiError.notFound('Doctor not found');
  }

  const existingMapping = await Mapping.findOne({
    where: { patientId, doctorId },
  });
  if (existingMapping) {
    throw ApiError.conflict('This doctor is already assigned to this patient');
  }

  const mapping = await Mapping.create({
    patientId,
    doctorId,
  });

  const populatedMapping = await Mapping.findByPk(mapping.id, {
    include: [
      {
        model: Patient,
        as: 'patient',
        attributes: ['id', 'name'],
      },
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['id', 'name', 'specialization'],
      },
    ],
  });

  return sendSuccess(res, 201, populatedMapping, 'Doctor assigned to patient successfully');
});

const getMappings = asyncHandler(async (req, res) => {
  const mappings = await Mapping.findAll({
    include: [
      {
        model: Patient,
        as: 'patient',
        where: { createdBy: req.user.id },
        required: true,
        attributes: ['id', 'name'],
      },
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['id', 'name', 'specialization'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return sendSuccess(res, 200, mappings, 'Mappings retrieved successfully');
});

const getDoctorsByPatient = asyncHandler(async (req, res) => {
  const { patient_id } = req.params;

  const patient = await Patient.findByPk(patient_id);
  if (!patient) {
    throw ApiError.notFound('Patient not found');
  }
  if (patient.createdBy !== req.user.id) {
    throw ApiError.forbidden('You do not have access to this patient');
  }

  const mappings = await Mapping.findAll({
    where: { patientId: patient.id },
    include: [
      {
        model: Doctor,
        as: 'doctor',
        attributes: ['id', 'name', 'specialization', 'email', 'phone', 'experience_years'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const doctors = mappings.map((m) => {
    const docData = m.doctor ? m.doctor.toJSON() : {};
    return {
      mappingId: m.id,
      ...docData,
    };
  });

  return sendSuccess(
    res,
    200,
    {
      id: patient.id,
      name: patient.name,
      patient: {
        id: patient.id,
        name: patient.name,
      },
      doctors,
    },
    'Doctors retrieved successfully'
  );
});

const deleteMapping = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mapping = await Mapping.findByPk(id, {
    include: [
      {
        model: Patient,
        as: 'patient',
      },
    ],
  });

  if (!mapping) {
    throw ApiError.notFound('Mapping not found');
  }

  if (!mapping.patient || mapping.patient.createdBy !== req.user.id) {
    throw ApiError.forbidden('You can only modify mappings of your own patients');
  }

  await mapping.destroy();

  return sendSuccess(res, 200, null, 'Doctor removed from patient successfully');
});

module.exports = {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping,
};
