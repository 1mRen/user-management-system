const db = require('../_helpers/db');

module.exports = {
    create,
    getByEmployeeId,
    updateStatus,
    initiateOnboarding
};

async function create(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee || !employee.isActive) throw 'Employee not found';
    
    return await db.Workflow.create(params);
}

async function getByEmployeeId(employeeId) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(employeeId);
    if (!employee) throw 'Employee not found';
    
    return await db.Workflow.findAll({
        where: { employeeId }
    });
}

async function updateStatus(id, params) {
    const workflow = await db.Workflow.findByPk(id);
    if (!workflow) throw new Error('Workflow not found');
    
    workflow.status = params.status;
    workflow.updated = new Date();
    await workflow.save();
    
    return workflow;
}

async function initiateOnboarding(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee || !employee.isActive) throw 'Employee not found';
    
    return await db.Workflow.create({
        employeeId: params.employeeId,
        type: 'Onboarding',
        details: params.details || { task: params.task || 'Setup workstation' },
        status: 'Pending'
    });
}