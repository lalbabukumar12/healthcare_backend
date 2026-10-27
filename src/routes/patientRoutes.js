const express = require('express');
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createPatientSchema,
  updatePatientSchema,
  idParamSchema,
} = require('../validators/patientValidator');

const router = express.Router();

// Apply JWT authentication protection to all patient endpoints
router.use(protect);

router
  .route('/')
  .post(validate(createPatientSchema), createPatient)
  .get(getPatients);

router
  .route('/:id')
  .get(validate(idParamSchema, 'params'), getPatientById)
  .put(validate(idParamSchema, 'params'), validate(updatePatientSchema), updatePatient)
  .delete(validate(idParamSchema, 'params'), deletePatient);

module.exports = router;
