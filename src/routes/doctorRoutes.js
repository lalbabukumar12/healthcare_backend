const express = require('express');
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createDoctorSchema,
  updateDoctorSchema,
  idParamSchema,
} = require('../validators/doctorValidator');

const router = express.Router();

// Apply JWT authentication protection to all doctor endpoints
router.use(protect);

router
  .route('/')
  .post(validate(createDoctorSchema), createDoctor)
  .get(getDoctors);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), getDoctorById)
  .put(validate(idParamSchema, 'params'), validate(updateDoctorSchema), updateDoctor)
  .delete(validate(idParamSchema, 'params'), deleteDoctor);

module.exports = router;
