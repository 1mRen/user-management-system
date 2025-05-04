const { DataTypes } = require('sequelize');
module.exports = model;

function model(sequelize) {
  const attributes = {
    accountId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts', // This references the table name
        key: 'id'
      }
    },
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
    },
    hooks: {
      // We'll add hooks to maintain sync with account's isActive
      afterUpdate: async (employee, options) => {
        // This hook will update the corresponding account's isActive field
        if (employee.changed('isActive') && employee.accountId) {
          const Account = sequelize.models.account;
          await Account.update(
            { isActive: employee.isActive },
            { 
              where: { id: employee.accountId },
              individualHooks: false,
              transaction: options.transaction
            }
          );
        }

        // Also sync status changes to isActive
        if (employee.changed('status')) {
          const isActiveStatus = employee.status === 'active';
          if (employee.isActive !== isActiveStatus) {
            employee.isActive = isActiveStatus;
            const Account = sequelize.models.account;
            await Account.update(
              { isActive: isActiveStatus },
              { 
                where: { id: employee.accountId },
                individualHooks: false,
                transaction: options.transaction
              }
            );
          }
        }
      },
      afterCreate: async (employee, options) => {
        // Sync isActive to account upon creation as well
        const Account = sequelize.models.account;
        await Account.update(
          { isActive: employee.isActive },
          { 
            where: { id: employee.accountId },
            individualHooks: false,
            transaction: options.transaction
          }
        );
      }
    }
  };

  return sequelize.define('employee', attributes, options);
}