const db = require('../_helpers/db');

module.exports = {
    getByEmployeeId,
    create,
    updateStatus,
    initiateOnboarding
};

async function getByEmployeeId(employeeId) {
    return await db.Workflow.findAll({
        where: { employeeId },
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'AssignedEmployee',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
}

async function create(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee || !employee.isActive) throw 'Employee not found';

    // Create workflow
    const workflow = await db.Workflow.create(params);
    
    // Get workflow with associations
    return await db.Workflow.findByPk(workflow.id, {
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'AssignedEmployee',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
}

async function updateStatus(id, params) {
    const workflow = await db.Workflow.findByPk(id);
    if (!workflow) throw 'Workflow not found';

    // Update workflow status
    Object.assign(workflow, { 
        status: params.status,
        updated: new Date()
    });
    
    // If status is completed, set end date
    if (params.status === 'completed' && workflow.status !== 'completed') {
        workflow.endDate = new Date();
    }
    
    await workflow.save();
    
    // Get updated workflow with associations
    return await db.Workflow.findByPk(id, {
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'AssignedEmployee',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
}

async function initiateOnboarding(params) {
    // Validate employee exists
    const employee = await db.Employee.findByPk(params.employeeId);
    if (!employee || !employee.isActive) throw 'Employee not found';

    // Create onboarding workflow
    const workflow = await db.Workflow.create({
        employeeId: params.employeeId,
        type: 'onboarding',
        status: 'in_progress',
        details: params.details || {
            tasks: [
                { name: 'Setup workstation', completed: false },
                { name: 'Assign email account', completed: false },
                { name: 'Security access', completed: false },
                { name: 'Department orientation', completed: false }
            ]
        }
    });

    // Get workflow with associations
    return await db.Workflow.findByPk(workflow.id, {
        include: [
            { 
                model: db.Employee, 
                as: 'employee',
                include: [
                    { model: db.Account, as: 'account', attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
}