const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize) {
  const attributes = {
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    type: { 
      type: DataTypes.ENUM, 
      values: ['onboarding', 'offboarding', 'promotion', 'transfer', 'other'],
      allowNull: false 
    },
    status: { 
      type: DataTypes.ENUM, 
      values: ['pending', 'in_progress', 'completed', 'cancelled'],
      defaultValue: 'pending',
      allowNull: false 
    },
    startDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    endDate: { type: DataTypes.DATE },
    details: { type: DataTypes.JSON },
    notes: { type: DataTypes.TEXT },
    assignedTo: { type: DataTypes.INTEGER },
    created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated: { type: DataTypes.DATE }
  };

  const options = {
    timestamps: false,
    defaultScope: {
      attributes: {}
    }
  };

  return sequelize.define('workflow', attributes, options);
}