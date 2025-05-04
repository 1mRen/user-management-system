const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    getByEmployeeId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Request.findAll({
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'Approver',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
}

async function getById(id) {
    const request = await db.Request.findByPk(id, {
        include: [
            { 
                model: db.Employee,
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            },
            {
                model: db.Employee, 
                as: 'Approver',
                include: [
                    { model: db.Account, attributes: ['id', 'firstName', 'lastName', 'email'] }
                ]
            }
        ]
    });
    
    if (!request) throw 'Request not found';
    return request;
}

async function getByEmployeeId(employeeId) {
    return await db.Request.findAll({
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
                as: 'Approver',
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

    // Create request
    const request = await db.Request.create(params);
    
    // Create workflow for certain request types that require workflow tracking
    if (['promotion', 'transfer', 'equipment', 'leave'].includes(params.type?.toLowerCase())) {
        await db.Workflow.create({
            employeeId: params.employeeId,
            type: `Request: ${params.type}`,
            status: 'Pending',
            details: {
                requestId: request.id,
                requestType: params.type,
                requestDate: new Date(),
                description: params.description || params.reason || 'New request'
            }
        });
    }
    
    return await getById(request.id);
}

async function update(id, params) {
    const request = await getById(id);

    // Update request
    Object.assign(request, params, { updated: new Date() });
    
    // If status is changed to completed, set completion date
    if (params.status === 'completed' && request.status !== 'completed') {
        request.completionDate = new Date();
        
        // Update associated workflow if it exists
        const workflow = await db.Workflow.findOne({
            where: {
                employeeId: request.employeeId,
                details: { requestId: request.id }
            }
        });
        
        if (workflow) {
            workflow.status = 'Completed';
            workflow.updated = new Date();
            await workflow.save();
        }
    } else if (params.status === 'rejected' && request.status !== 'rejected') {
        // Update associated workflow if it exists
        const workflow = await db.Workflow.findOne({
            where: {
                employeeId: request.employeeId,
                details: { requestId: request.id }
            }
        });
        
        if (workflow) {
            workflow.status = 'Cancelled';
            workflow.updated = new Date();
            await workflow.save();
        }
    }
    
    await request.save();
    return await getById(id);
}

async function _delete(id) {
    const request = await getById(id);
    
    // Find and update associated workflow if it exists
    const workflow = await db.Workflow.findOne({
        where: {
            employeeId: request.employeeId,
            details: { requestId: request.id }
        }
    });
    
    if (workflow) {
        workflow.status = 'Cancelled';
        workflow.updated = new Date();
        await workflow.save();
    }
    
    await request.destroy();
}