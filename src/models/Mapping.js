const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mapping = sequelize.define(
  'Mapping',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Patients',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Doctors',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'Mappings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['patientId', 'doctorId'],
      },
    ],
  }
);

module.exports = Mapping;
