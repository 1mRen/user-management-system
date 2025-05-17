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
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts', // Changed from 'account' to 'accounts'
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