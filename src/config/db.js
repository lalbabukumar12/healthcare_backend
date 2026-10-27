require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Client } = require('pg');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connected successfully.');
  } catch (error) {
    // If the target database does not exist, attempt to create it automatically
    if (error.original && (error.original.code === '3D000' || error.message.includes('does not exist'))) {
      try {
        console.log(`Database "${process.env.DB_NAME}" does not exist. Creating it now...`);
        const adminClient = new Client({
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT, 10) || 5432,
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD,
          database: 'postgres',
        });
        await adminClient.connect();
        await adminClient.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
        await adminClient.end();
        console.log(`Database "${process.env.DB_NAME}" created successfully.`);

        await sequelize.authenticate();
        console.log('PostgreSQL database connected successfully.');
        return;
      } catch (createErr) {
        console.error('Failed to create database:', createErr.message);
      }
    }

    console.error('Unable to connect to the PostgreSQL database:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectDB,
};
