const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get(['/', ''], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Healthcare Backend API is running',
    endpoints: {
      health: '/health',
      api: '/api',
    },
  });
});

// Health check endpoint (supports /health and /health/)
app.get(['/health', '/health/'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API running',
  });
});

// Mount API routes
app.use('/api', routes);

// 404 handler for unknown routes
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
