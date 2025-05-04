const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize) {
  const attributes = {
    name: { 
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
    },
    description: { 
      type: DataTypes.STRING 
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    created: { 
      type: DataTypes.DATE, 
      allowNull: false, 
      defaultValue: DataTypes.NOW 
    },
    updated: { 
      type: DataTypes.DATE 
    },
    isActive: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: true 
    }
  };

  const options = {
    timestamps: false,
    defaultScope: {
      attributes: {}
    }
  };

  return sequelize.define('department', attributes, options);
}