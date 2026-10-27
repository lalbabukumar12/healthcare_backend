const { Doctor } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const sendSuccess = require('../utils/response');

const findDoctorAndCheckOwnership = async (id, userId) => {
  const doctor = await Doctor.findByPk(id);
  if (!doctor) {
    throw ApiError.notFound('Doctor not found');
  }
  if (doctor.createdBy !== userId) {
    throw ApiError.forbidden('You can only modify doctors you created');
  }
  return doctor;
};

const createDoctor = asyncHandler(async (req, res) => {
  const existingDoctor = await Doctor.findOne({
    where: { email: req.body.email.toLowerCase() },
  });

  if (existingDoctor) {
    throw ApiError.conflict('Doctor with this email already exists');
  }

  const doctor = await Doctor.create({
    ...req.body,
    createdBy: req.user.id,
  });

  return sendSuccess(res, 201, doctor, 'Doctor created successfully');
});

const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.findAll({
    order: [['createdAt', 'DESC']],
  });

  return sendSuccess(res, 200, doctors, 'Doctors retrieved successfully');
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) {
    throw ApiError.notFound('Doctor not found');
  }

  return sendSuccess(res, 200, doctor, 'Doctor retrieved successfully');
});

const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await findDoctorAndCheckOwnership(req.params.id, req.user.id);

  if (req.body.email && req.body.email.toLowerCase() !== doctor.email.toLowerCase()) {
    const existingDoctor = await Doctor.findOne({
      where: { email: req.body.email.toLowerCase() },
    });
    if (existingDoctor) {
      throw ApiError.conflict('Doctor with this email already exists');
    }
  }

  await doctor.update(req.body);

  return sendSuccess(res, 200, doctor, 'Doctor updated successfully');
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await findDoctorAndCheckOwnership(req.params.id, req.user.id);
  await doctor.destroy();

  return sendSuccess(res, 200, null, 'Doctor deleted successfully');
});

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
