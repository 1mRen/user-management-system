require('dotenv').config();
const { Sequelize } = require('sequelize');

// Initialize the db object to be exported
const db = {};

initialize();

async function initialize() {
    try {
        // Create Sequelize instance with environment variables
        const sequelize = new Sequelize(
            process.env.DATABASE_NAME || process.env.DB_NAME,
            process.env.DATABASE_USER || process.env.DB_USER,
            process.env.DATABASE_PASSWORD || process.env.DB_PASS,
            {
                host: process.env.DATABASE_HOST || process.env.DB_HOST,
                port: process.env.DATABASE_PORT || process.env.DB_PORT,
                dialect: 'mysql',
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                logging: false
            }
        );

        // Add sequelize to db object
        db.sequelize = sequelize;

        // Import models
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
        db.Department = require('../departments/department.model')(sequelize);
        db.Employee = require('../employees/employee.model')(sequelize);
        db.Request = require('../request/request.model')(sequelize);
        db.Workflow = require('../workflows/workflow.model')(sequelize);

        // Define relationships
        // Account relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        
        // Account - Employee (One-to-One)
        db.Account.hasOne(db.Employee, { foreignKey: 'accountId' });
        db.Employee.belongsTo(db.Account, { foreignKey: 'accountId' });
        
        // Department - Employee (One-to-Many)
        db.Department.hasMany(db.Employee, { foreignKey: 'departmentId' });
        db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId' });
        
        // Employee - Request (One-to-Many)
        db.Employee.hasMany(db.Request, { foreignKey: 'employeeId' });
        db.Request.belongsTo(db.Employee, { foreignKey: 'employeeId' });
        
        // Employee - Workflow (One-to-Many)
        db.Employee.hasMany(db.Workflow, { foreignKey: 'employeeId' });
        db.Workflow.belongsTo(db.Employee, { foreignKey: 'employeeId' });
        
        // Employee - Department (Manager)
        db.Employee.hasOne(db.Department, { foreignKey: 'managerId', as: 'ManagedDepartment' });
        db.Department.belongsTo(db.Employee, { foreignKey: 'managerId', as: 'Manager' });
        
        // Approver - Request (One-to-Many)
        db.Employee.hasMany(db.Request, { foreignKey: 'approverId', as: 'ApprovedRequests' });
        db.Request.belongsTo(db.Employee, { foreignKey: 'approverId', as: 'Approver' });
        
        // Assigned Employee - Workflow (One-to-Many)
        db.Employee.hasMany(db.Workflow, { foreignKey: 'assignedTo', as: 'AssignedWorkflows' });
        db.Workflow.belongsTo(db.Employee, { foreignKey: 'assignedTo', as: 'AssignedEmployee' });

        // Sync all models with database
        await sequelize.sync({ alter: true });

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

module.exports = db;