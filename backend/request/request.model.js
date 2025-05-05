const { DataTypes } = require('sequelize');

function model(sequelize) {
  const attributes = {
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    type: { 
      type: DataTypes.ENUM, 
      values: ['leave', 'equipment', 'resources'],
      allowNull: false 
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { 
      type: DataTypes.ENUM, 
      values: ['pending', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'],
      defaultValue: 'pending',
      allowNull: false 
    },  
    priority: { 
      type: DataTypes.ENUM, 
      values: ['low', 'medium', 'high', 'urgent'],
      defaultValue: 'medium',
      allowNull: false 
    },
    requestDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    completionDate: { type: DataTypes.DATE },
    approverId: { type: DataTypes.INTEGER },
    details: { type: DataTypes.JSON },
    created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated: { type: DataTypes.DATE }
  };

  const options = {
    timestamps: false,
    defaultScope: {
      attributes: {}
    }
  };

  return sequelize.define('request', attributes, options);
}

module.exports = model;