const express = require('express');
const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes');
const mappingRoutes = require('./mappingRoutes');

const router = express.Router();

router.get(['/health', '/health/'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API running',
  });
});

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/mappings', mappingRoutes);

module.exports = router;
