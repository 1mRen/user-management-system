require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize the db object to be exported
const db = {};

initialize();

async function initialize() {
    try {
        // Load database config from .env with fallbacks
        const host = process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost';
        const port = process.env.DATABASE_PORT || process.env.DB_PORT || 3306;
        const user = process.env.DATABASE_USER || process.env.DB_USER;
        const password = process.env.DATABASE_PASSWORD || process.env.DB_PASS;
        const database = process.env.DATABASE_NAME || process.env.DB_NAME || 'user-management-system';

        // Create DB if it doesn't exist
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await connection.end();

        // Create Sequelize instance
        const sequelize = new Sequelize(database, user, password, {
            host,
            port,
            dialect: 'mysql',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: false // Set to true if you want to see SQL logs
        });

        // Add sequelize to db object
        db.sequelize = sequelize;

        // Import models - FIX: Use direct require paths to avoid function call error
        db.Account = require(path.join(process.cwd(), 'accounts/account.model'))(sequelize);
        db.RefreshToken = require(path.join(process.cwd(), 'accounts/refresh-token.model'))(sequelize);
        db.Department = require(path.join(process.cwd(), 'departments/department.model'))(sequelize);
        db.Employee = require(path.join(process.cwd(), 'employees/employee.model'))(sequelize); 
        db.Request = require(path.join(process.cwd(), 'request/request.model'))(sequelize);
        db.Workflow = require(path.join(process.cwd(), 'workflows/workflow.model'))(sequelize);

        // Define relationships
        // Account relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);
        
        // Account - Employee (One-to-One)
        db.Account.hasOne(db.Employee, { 
            foreignKey: 'accountId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        db.Employee.belongsTo(db.Account, { 
            foreignKey: 'accountId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Custom hooks for isActive synchronization between Account and Employee
        db.Account.addHook('afterUpdate', async (account, options) => {
            // If account isActive changed, update the associated employee
            if (account.changed('isActive')) {
                const employee = await db.Employee.findOne({ 
                    where: { accountId: account.id },
                    transaction: options.transaction
                });
                
                if (employee) {
                    employee.isActive = account.isActive;
                    
                    // Update status to match isActive if needed
                    if (account.isActive && employee.status !== 'active') {
                        employee.status = 'active';
                    } else if (!account.isActive && employee.status === 'active') {
                        employee.status = 'suspended';
                    }
                    
                    await employee.save({ 
                        transaction: options.transaction,
                        hooks: false // Prevent infinite loop
                    });
                }
            }
        });
        
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
        console.error('Database connection failed:', error);  // Log the entire error object
        console.error('Stack trace:', error.stack);  // This will show where the error occurred
    }
}

module.exports = db;