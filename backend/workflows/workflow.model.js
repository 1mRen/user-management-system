const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    type: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    status: { 
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false 
    },
    details: { type: DataTypes.JSON },
    assignedTo: { type: DataTypes.INTEGER },
    created: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
    updated: { 
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  };

  const options = {
    timestamps: false
  };

  return sequelize.define('workflow', attributes, options);
}