const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize) {
  const attributes = {
    accountId: { type: DataTypes.INTEGER },
    departmentId: { type: DataTypes.INTEGER, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    salary: { type: DataTypes.DECIMAL(10, 2) },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE },
    employeeNumber: { type: DataTypes.STRING },
    manager: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { 
      type: DataTypes.ENUM,
      values: ['active', 'on_leave', 'terminated', 'suspended'],
      defaultValue: 'active',
      allowNull: false
    },
    created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated: { type: DataTypes.DATE },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  };

  const options = {
    timestamps: false,
    defaultScope: {
      attributes: {}
    }
  };

  return sequelize.define('employee', attributes, options);
}