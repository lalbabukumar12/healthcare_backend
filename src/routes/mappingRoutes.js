const express = require('express');
const {
  createMapping,
  getMappings,
  getDoctorsByPatient,
  deleteMapping,
} = require('../controllers/mappingController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createMappingSchema,
  patientIdParamSchema,
  idParamSchema,
} = require('../validators/mappingValidator');

const router = express.Router();

// Apply JWT authentication protection to all mapping endpoints
router.use(protect);

router
  .route('/')
  .post(validate(createMappingSchema), createMapping)
  .get(getMappings);

router
  .route('/:patient_id')
  .get(validate(patientIdParamSchema, 'params'), getDoctorsByPatient);

router
  .route('/:id')
  .delete(validate(idParamSchema, 'params'), deleteMapping);

module.exports = router;
