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

    // Create employee
    const employee = await db.Employee.create({
        ...params,
        startDate: params.startDate || new Date()
    });

    return await getById(employee.id);
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

    return await getById(id);
}

async function _delete(id) {
    const employee = await getById(id);
    
    // Soft delete by setting isActive to false
    Object.assign(employee, { isActive: false, updated: new Date() });
    await employee.save();
}

async function transferEmployee(id, params) {
    const employee = await getById(id);
    
    // Validate department exists
    const department = await db.Department.findByPk(params.departmentId);
    if (!department || !department.isActive) throw 'Department not found';

    // Update employee department
    employee.departmentId = params.departmentId;
    employee.updated = new Date();
    await employee.save();

    // Create transfer workflow
    await db.Workflow.create({
        employeeId: id,
        type: 'transfer',
        status: 'completed',
        details: {
            oldDepartmentId: employee.departmentId,
            newDepartmentId: params.departmentId,
            reason: params.reason || 'Department transfer'
        }
    });

    return await getById(id);
}