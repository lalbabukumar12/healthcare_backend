require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

let server;

const listenWithRetry = (port, maxRetries = 5, delayMs = 500) => {
  return new Promise((resolve, reject) => {
    const tryListen = (retriesLeft) => {
      const srv = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        resolve(srv);
      });

      srv.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
          console.warn(`Port ${port} busy, waiting for release (${retriesLeft} retries left)...`);
          srv.close();
          setTimeout(() => tryListen(retriesLeft - 1), delayMs);
        } else {
          reject(err);
        }
      });
    };

    tryListen(maxRetries);
  });
};

const startServer = async () => {
  try {
    await connectDB();

    try {
      await sequelize.sync({ alter: true });
    } catch (syncError) {
      if (syncError.message && syncError.message.includes('cache lookup failed')) {
        console.warn('PostgreSQL catalog notice during alter; falling back to standard sync.');
        await sequelize.sync();
      } else {
        throw syncError;
      }
    }

    console.log('Database synced');

    server = await listenWithRetry(PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

const handleShutdown = (signal) => {
  if (server) {
    server.close(() => {
      console.log(`Server closed gracefully due to ${signal}`);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGUSR2', () => handleShutdown('SIGUSR2'));

startServer();
