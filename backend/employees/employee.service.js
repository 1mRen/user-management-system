const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    transferEmployee
};

async function getAll() {
    return await db.Employee.findAll({
        where: { isActive: true },
        include: [
            { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: db.Department, attributes: ['id', 'name'] }
        ]
    });
}

async function getById(id) {
    const employee = await db.Employee.findByPk(id, {
        include: [
            { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] },
            { model: db.Department, attributes: ['id', 'name'] }
        ]
    });
    
    if (!employee || !employee.isActive) throw 'Employee not found';
    return employee;
}

async function create(params) {
    // Validate
    if (params.accountId && await db.Employee.findOne({ where: { accountId: params.accountId, isActive: true } })) {
        throw 'Account already has an employee record';
    }
    
    // Validate department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department || !department.isActive) throw 'Department not found';
    
    // Use a transaction to ensure both employee and workflow are created
    const result = await db.sequelize.transaction(async (t) => {
        // Create employee
        const employee = await db.Employee.create({
            ...params,
            startDate: params.startDate || new Date()
        }, { transaction: t });
        
        // Always create onboarding workflow regardless of params.createOnboarding
        await db.Workflow.create({
            employeeId: employee.id,
            type: 'Onboarding',
            details: {
                task: "Setup workstation"
            },
            status: 'Pending'
        }, { transaction: t });
        
        return employee;
    });
    
    // Get full employee details
    return await getById(result.id);
}

async function update(id, params) {
    const employee = await getById(id);
    
    // Validate department if being changed
    if (params.departmentId && employee.departmentId !== params.departmentId) {
        const department = await db.Department.findByPk(params.departmentId);
        if (!department || !department.isActive) throw 'Department not found';
    }
    
    // Update employee
    Object.assign(employee, params, { updated: new Date() });
    await employee.save();
    
    // Create promotion workflow if position is changing
    if (params.position && employee.position !== params.position) {
        await db.Workflow.create({
            employeeId: employee.id,
            type: 'Promotion',
            details: {
                oldPosition: employee.position,
                newPosition: params.position,
                reason: params.reason || 'Position change'
            },
            status: 'Completed'
        });
    }
    
    return await getById(id);
}

async function _delete(id) {
    const employee = await getById(id);
    
    // Soft delete by setting isActive to false
    Object.assign(employee, { isActive: false, updated: new Date() });
    await employee.save();
    
    // Create offboarding workflow
    await db.Workflow.create({
        employeeId: employee.id,
        type: 'Offboarding',
        details: {
            reason: 'Employee deactivated',
            tasks: [
                { name: 'Revoke access', completed: false },
            ]
        },
        status: 'Pending'
    });
}

async function transferEmployee(id, params) {
    const employee = await getById(id);
    
    // Validate department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department || !department.isActive) throw 'Department not found';
    
    // Store old department for workflow
    const oldDepartmentId = employee.departmentId;
    
    // Update employee department
    employee.departmentId = params.departmentId;
    employee.updated = new Date();
    await employee.save();
    
    // Create transfer workflow
    await db.Workflow.create({
        employeeId: id,
        type: 'Transfer',
        status: 'Completed',
        details: {
            oldDepartmentId: oldDepartmentId,
            newDepartmentId: params.departmentId,
            reason: params.reason || 'Department transfer'
        }
    });
    
    return await getById(id);
}